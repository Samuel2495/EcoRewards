import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Scale, Calendar, FileText, Crosshair, CheckCircle, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const BulkRecycle = () => {
    const { hubs, requestPickup } = useData();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        materialType: 'Plastic',
        weight: '',
        address: user?.address || '',
        contact: user?.phone || '',
        date: '',
        description: ''
    });

    const [nearestHub, setNearestHub] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFindNearestHub = () => {
        setIsLoadingLocation(true);
        setLocationError(null);
        setNearestHub(null);

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
                        errorMessage = "Location permission denied. Please select a hub manually or enable location.";
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!nearestHub) {
            setLocationError("Please find a nearest hub before submitting.");
            return;
        }

        const pickupData = {
            ...formData,
            hubId: nearestHub.id,
            hubName: nearestHub.name
        };

        const result = requestPickup(pickupData);

        if (result.success) {
            setSubmitStatus('success');
            // Reset form
            setFormData({
                materialType: 'Plastic',
                weight: '',
                address: user?.address || '',
                contact: user?.phone || '',
                date: '',
                description: ''
            });
            setNearestHub(null);
            setTimeout(() => setSubmitStatus(null), 5000);
        } else {
            setSubmitStatus('error');
            setLocationError(result.message);
        }
    };

    return (
        <div className="py-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">
                    Bulk Recycle Pickup
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Have a lot to recycle? Schedule a pickup with your nearest disposal hub.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-8 rounded-3xl border border-white/10"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Truck className="text-emerald-500" /> Pickup Details
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Material Type</label>
                                <div className="relative">
                                    <select
                                        name="materialType"
                                        value={formData.materialType}
                                        onChange={handleInputChange}
                                        className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 appearance-none"
                                    >
                                        <option value="Plastic">Plastic</option>
                                        <option value="E-Waste">E-Waste</option>
                                        <option value="Paper">Paper</option>
                                        <option value="Metal">Metal</option>
                                        <option value="Mixed">Mixed Recyclables</option>
                                    </select>
                                    <div className="absolute right-4 top-3.5 pointer-events-none text-gray-400">▼</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Approx. Weight (kg)</label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 5"
                                        required
                                        min="1"
                                        className="w-full bg-neutral-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Pickup Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full address"
                                    required
                                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Contact Number</label>
                                <input
                                    type="tel"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    placeholder="+91 9999999999"
                                    required
                                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Preferred Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-neutral-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Additional Notes</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 text-gray-500" size={18} />
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Any specific details about the items..."
                                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-24 resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full py-4 text-lg" disabled={!nearestHub}>
                                {nearestHub ? 'Request Pickup' : 'Find Nearest Hub First'}
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {/* Hub Selection Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="glass p-8 rounded-3xl border border-white/10 h-full flex flex-col">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <MapPin className="text-emerald-500" /> Nearest Disposal Hub
                        </h2>

                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-neutral-900/50 rounded-2xl border border-white/5 border-dashed">
                            {nearestHub ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                                        <MapPin size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{nearestHub.name}</h3>
                                    <p className="text-gray-400 mb-6">{nearestHub.address}</p>

                                    <div className="flex flex-col gap-3 text-sm text-gray-300 bg-black/20 p-4 rounded-xl">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Coordinator:</span>
                                            <span className="font-medium text-white">{nearestHub.coordinator}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span>Contact:</span>
                                            <span className="font-medium text-white">{nearestHub.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Distance:</span>
                                            <span className="font-medium text-emerald-400">~2.4 km</span>
                                            {/* Note: In a real app, pass exact distance calculated */}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 py-2 px-4 rounded-full w-fit mx-auto">
                                        <CheckCircle size={16} /> Hub Selected for Pickup
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="max-w-xs">
                                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-gray-600 mx-auto mb-4">
                                        <Crosshair size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-300 mb-2">Locate Nearest Hub</h3>
                                    <p className="text-gray-500 mb-6 text-sm">
                                        We need to identify the closest disposal hub to assign your pickup request.
                                    </p>
                                    <Button
                                        onClick={handleFindNearestHub}
                                        disabled={isLoadingLocation}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <Crosshair size={18} />
                                        {isLoadingLocation ? 'Locating...' : 'Find Nearest Hub'}
                                    </Button>
                                    {locationError && (
                                        <p className="text-red-400 text-xs mt-3 bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
                                            <AlertTriangle size={12} className="inline mr-1" />
                                            {locationError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {submitStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-200"
                            >
                                <CheckCircle size={24} className="shrink-0" />
                                <div>
                                    <p className="font-bold">Request Submitted!</p>
                                    <p className="text-sm opacity-80">We have notified {nearestHub?.name}. They will contact you shortly.</p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BulkRecycle;
