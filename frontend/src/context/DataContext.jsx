import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

const INITIAL_TASKS = [
    { id: 1, title: 'Recycle Plastic', description: 'Collect and segregate 1kg of plastic waste', points: 50, credits: 20 },
    { id: 2, title: 'Plant a Tree', description: 'Plant a sapling in your neighborhood', points: 100, credits: 40 },
    { id: 3, title: 'Community Cleanup', description: 'Participate in a local cleanup drive', points: 80, credits: 30 },
    { id: 4, title: 'E-Waste Disposal', description: 'Dispose of electronic waste at a certified center', points: 60, credits: 25 },
    { id: 5, title: 'Composting', description: 'Start a compost bin for kitchen waste', points: 70, credits: 25 },
];

const INITIAL_HUBS = [
    {
        id: 1,
        code: "VYT-HUB",
        name: "Vytilla Hub",
        address: "Near Vytilla Mobility Hub, SA Road Junction, Vytilla, Kochi - 682019",
        coordinator: "Arjun Menon",
        phone: "+91 9847562310",
        email: "vytilla.hub@ecorewards.in",
        timings: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sun: 10:00 AM - 4:00 PM"],
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.566355418933!2d76.31494437505151!3d9.96987747355187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0872f54d588da5%3A0x6b77e8a937a347d4!2sVyttila%20Mobility%20Hub!5e0!3m2!1sen!2sin!4v1707763200000!5m2!1sen!2sin",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Vyttila+Mobility+Hub+Kochi",
        lat: 9.9698,
        lng: 76.3149
    },
    {
        id: 2,
        code: "INF-HUB",
        name: "Kakkanad InfoPark",
        address: "Near Athulya Building, InfoPark Campus, Kakkanad, Kochi - 682042",
        coordinator: "Priya Krishnan",
        phone: "+91 9956234178",
        email: "infopark.hub@ecorewards.in",
        timings: ["Mon - Fri: 8:00 AM - 8:00 PM", "Sat: 9:00 AM - 5:00 PM"],
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.862086616086!2d76.36647231479435!3d10.008817992844876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c8e94a07a07%3A0x493a7d4334584226!2sInfopark%20Kochi!5e0!3m2!1sen!2sin!4v1707763200002!5m2!1sen!2sin",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Infopark+Kochi",
        lat: 10.0088,
        lng: 76.3665
    },
    {
        id: 3,
        code: "KLM-HUB",
        name: "Kalamassery Town",
        address: "Near CUSAT Junction, NH-47, Kalamassery, Kochi - 682022",
        coordinator: "Rajesh Nair",
        phone: "+91 9745831269",
        email: "kalamassery.hub@ecorewards.in",
        timings: ["Mon - Sat: 8:30 AM - 7:00 PM", "Sun: 9:00 AM - 3:00 PM"],
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.5330335016255!2d76.3262600750529!3d10.057997972685794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c3619a957d1%3A0x6b4539a263720760!2sCUSAT%20Junction!5e0!3m2!1sen!2sin!4v1707763200003!5m2!1sen!2sin",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=CUSAT+Junction+Kochi",
        lat: 10.0580,
        lng: 76.3263
    },
    {
        id: 4,
        code: "HMT-HUB",
        name: "HMT Junction",
        address: "Opposite HMT Factory, Kalamassery, North Kalamassery, Kochi - 683104",
        coordinator: "Arun Kumar",
        phone: "+91 9847123560",
        email: "hmt.hub@ecorewards.in",
        timings: ["Mon - Sat: 9:00 AM - 6:30 PM", "Sun: Closed"],
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.6300465228!2d76.34212307505267!3d10.045050972776317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c44566c8f9b%3A0x3f5d50694186064f!2sHMT%20Junction!5e0!3m2!1sen!2sin!4v1707763200004!5m2!1sen!2sin",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=HMT+Junction+Kalamassery",
        lat: 10.0451,
        lng: 76.3421
    },
    {
        id: 5,
        code: "FTK-HUB",
        name: "Fort Kochi",
        address: "Near Chinese Fishing Nets, Vasco da Gama Square, Fort Kochi, Kochi - 682001",
        coordinator: "Maya Varghese",
        phone: "+91 9956784230",
        email: "fortkochi.hub@ecorewards.in",
        timings: ["Mon - Sun: 8:00 AM - 7:00 PM"],
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.563032128956!2d76.2407663750516!3d9.96739097341398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b086d30f3055555%3A0x1d30555555555555!2sFort%20Kochi%20Beach!5e0!3m2!1sen!2sin!4v1707763200005!5m2!1sen!2sin",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Fort+Kochi+Beach",
        lat: 9.9674,
        lng: 76.2408
    }
];

const INITIAL_REWARDS = [
    { id: 1, title: 'Movie Tickets', cost: 500, type: 'points' },
    { id: 2, title: 'Shopping Voucher', cost: 1000, type: 'points' },
    { id: 3, title: 'Tree Planting Certificate', cost: 200, type: 'credits' },
];

export function DataProvider({ children }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [hubs, setHubs] = useState(INITIAL_HUBS);

    const [pickupRequests, setPickupRequests] = useState([]);

    useEffect(() => {
        // Initialize local storage with default data if empty
        if (!localStorage.getItem('tasks')) {
            localStorage.setItem('tasks', JSON.stringify(INITIAL_TASKS));
        }
        if (!localStorage.getItem('rewards')) {
            localStorage.setItem('rewards', JSON.stringify(INITIAL_REWARDS));
        }
        if (!localStorage.getItem('pickupRequests')) {
            localStorage.setItem('pickupRequests', JSON.stringify([]));
        }

        setTasks(JSON.parse(localStorage.getItem('tasks')));
        setRewards(JSON.parse(localStorage.getItem('rewards')));
        setPickupRequests(JSON.parse(localStorage.getItem('pickupRequests')));
    }, []);

    useEffect(() => {
        if (user) {
            const storedUserTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
            setUserTasks(storedUserTasks);
        } else {
            setUserTasks([]);
        }
    }, [user]);

    const completeTask = (taskId) => {
        if (!user) return;

        const task = tasks.find(t => t.id === taskId);
        const newRecord = {
            taskId,
            status: 'pending', // Pending verification
            timestamp: new Date().toISOString()
        };

        const updatedUserTasks = [...userTasks, newRecord];
        setUserTasks(updatedUserTasks);
        localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedUserTasks));
    };

    const verifyTask = (userId, taskId, approved) => {
        const userTasksKey = `tasks_${userId}`;
        const userTasks = JSON.parse(localStorage.getItem(userTasksKey) || '[]');

        const updatedTasks = userTasks.map(t => {
            if (t.taskId === taskId && t.status === 'pending') {
                return { ...t, status: approved ? 'approved' : 'rejected' };
            }
            return t;
        });

        localStorage.setItem(userTasksKey, JSON.stringify(updatedTasks));

        // If approved, update user points
        if (approved) {
            const task = tasks.find(t => t.id === taskId);
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);

            if (userIndex !== -1 && task) {
                users[userIndex].points += task.points;
                users[userIndex].credits += task.credits;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }

        // Refresh local state if it's the current user
        if (user && user.id === userId) {
            setUserTasks(updatedTasks);
        }
    };

    const getAllUsers = () => {
        return JSON.parse(localStorage.getItem('users') || '[]');
    };

    const deleteUser = (userId) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Cleanup user tasks
        localStorage.removeItem(`tasks_${userId}`);
    };

    const requestPickup = (pickupData) => {
        if (!user) return { success: false, message: "User not logged in" };

        const newRequest = {
            id: Date.now(),
            userId: user.id,
            userName: user.username,
            ...pickupData,
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        const updatedRequests = [...pickupRequests, newRequest];
        setPickupRequests(updatedRequests);
        localStorage.setItem('pickupRequests', JSON.stringify(updatedRequests));

        return { success: true, message: "Pickup request submitted successfully!" };
    };

    const checkInToHub = (hubCode) => {
        if (!user) return { success: false, message: "User not logged in" };

        const hub = hubs.find(h => h.code === hubCode);
        if (!hub) {
            return { success: false, message: "Invalid Hub Code" };
        }

        // Limit check-ins? For now, allow multiple.
        // Award points
        const pointsAwarded = 50;

        // Update user
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex !== -1) {
            users[userIndex].points = (users[userIndex].points || 0) + pointsAwarded;
            localStorage.setItem('users', JSON.stringify(users));

            // Creating a check-in record
            const checkIns = JSON.parse(localStorage.getItem(`checkins_${user.id}`) || '[]');
            checkIns.push({
                hubId: hub.id,
                hubName: hub.name,
                timestamp: new Date().toISOString(),
                points: pointsAwarded
            });
            localStorage.setItem(`checkins_${user.id}`, JSON.stringify(checkIns));

            return { success: true, message: `Check-in successful! +${pointsAwarded} points awarded.`, points: pointsAwarded };
        }
        return { success: false, message: "User record not found" };
    };

    return (
        <DataContext.Provider value={{ tasks, rewards, userTasks, hubs, pickupRequests, completeTask, verifyTask, getAllUsers, deleteUser, checkInToHub, requestPickup }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => useContext(DataContext);
