import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Map, Navigation, Crosshair } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const HubCard = ({ hub, index, isNearest = false }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="h-[450px] perspective-1000 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-full h-full preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Side */}
                <div className={`absolute w-full h-full backface-hidden glass p-6 rounded-2xl flex flex-col items-center justify-between text-center ${isNearest ? 'border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20' : ''}`} style={{ backfaceVisibility: 'hidden' }}>
                    {isNearest && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Crosshair size={12} /> NEAREST
                        </div>
                    )}
                    <div className="w-full">
                        <div className="flex justify-center mb-6">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isNearest ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                                <MapPin size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{hub.name}</h3>
                        <p className="text-gray-300 mb-6 text-sm line-clamp-2">{hub.address}</p>

                        <div className="space-y-3 text-left w-full bg-white/5 p-4 rounded-xl border border-white/10">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Clock size={16} className="text-primary shrink-0" />
                                <div>
                                    <p className="font-medium text-white">Timings</p>
                                    <p className="text-xs text-gray-400">{hub.timings[0]}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Phone size={16} className="text-primary shrink-0" />
                                <a href={`tel:${hub.phone}`} onClick={(e) => e.stopPropagation()} className="hover:text-emerald-400 font-medium">{hub.phone}</a>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Mail size={16} className="text-primary shrink-0" />
                                <a href={`mailto:${hub.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-emerald-400 font-medium truncate">{hub.email}</a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
                        <Map size={16} /> Tap to view map
                    </div>
                </div>

                {/* Back Side */}
                <div
                    className={`absolute w-full h-full backface-hidden glass bg-neutral-900 overflow-hidden rounded-2xl flex flex-col ${isNearest ? 'border-2 border-emerald-500' : ''}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className="flex-1 w-full bg-gray-800 relative">
                        {hub.mapUrl ? (
                            <iframe
                                src={hub.mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full transition-all duration-300"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">Map not available</div>
                        )}
                    </div>

                    <div className="p-4 bg-neutral-900 border-t border-white/10">
                        <h3 className="text-lg font-bold text-white mb-1">{hub.name}</h3>
                        <p className="text-xs text-gray-400 mb-4 truncate">{hub.address}</p>

                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(hub.directionsUrl, '_blank');
                            }}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <Navigation size={18} /> Get Directions
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const DisposalHub = () => {
    const { hubs } = useData();
    const { user } = useAuth();
    const [nearestHub, setNearestHub] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    useEffect(() => {
        // Removed auto-check to ensure warning only shows after user interaction
    }, [hubs]);

    const handleEnableLocation = () => {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    findNearestHub(latitude, longitude);
                    setIsLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    let errorMessage = "Unable to retrieve your location.";
                    if (error.code === error.PERMISSION_DENIED) {
                        errorMessage = "Location permission denied. Please enable it in your browser settings.";
                    } else if (error.code === error.POSITION_UNAVAILABLE) {
                        errorMessage = "Location information is unavailable.";
                    } else if (error.code === error.TIMEOUT) {
                        errorMessage = "The request to get user location timed out.";
                    }
                    setLocationError(errorMessage);
                    setIsLoadingLocation(false);
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
            setIsLoadingLocation(false);
        }
    };

    const findNearestHub = (lat, lng) => {
        if (!hubs || hubs.length === 0) return;

        let minDistance = Infinity;
        let closest = null;

        hubs.forEach(hub => {
            if (hub.lat && hub.lng) {
                const distance = calculateDistance(lat, lng, hub.lat, hub.lng);
                if (distance < minDistance) {
                    minDistance = distance;
                    closest = hub;
                }
            }
        });

        setNearestHub(closest);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    return (
        <div className="py-10 relative">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                    Disposal Hub Locations
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                    Find your nearest eco-friendly disposal center. Tap a card to view its location on the map.
                </p>

                {!nearestHub && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <Button
                            onClick={handleEnableLocation}
                            disabled={isLoadingLocation}
                            className="flex items-center gap-2"
                        >
                            <Crosshair size={18} />
                            {isLoadingLocation ? 'Locating...' : 'Find Nearest Hub'}
                        </Button>
                        {locationError && (
                            <p className="text-red-400 text-sm">{locationError}</p>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {nearestHub && (
                <div className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto"
                    >
                        <h2 className="text-2xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
                            <Crosshair className="text-emerald-500" /> Nearest Hub For You
                        </h2>
                        <HubCard hub={nearestHub} isNearest={true} />

                    </motion.div>
                </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {hubs.map((hub, index) => (
                    <HubCard key={hub.id} hub={hub} index={index} />
                ))}
            </div>
        </div>
    );
};

export default DisposalHub;
