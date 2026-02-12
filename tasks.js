// Initialize the task database in the global scope
window.taskDatabase = [
    {
        id: 1,
        title: "Collect and Segregate Plastic",
        description: "Collect and segregate 1kg of plastic waste into recyclable and non-recyclable categories",
        points: 50,
        credits: 20
    },
    {
        id: 2,
        title: "Paper Collection Drive",
        description: "Collect 2kg of old newspapers and magazines for recycling",
        points: 40,
        credits: 15
    },
    {
        id: 3,
        title: "E-waste Collection",
        description: "Collect and properly dispose of electronic waste (minimum 500g)",
        points: 60,
        credits: 25
    },
    {
        id: 4,
        title: "Glass Bottle Collection",
        description: "Collect and clean 10 glass bottles for recycling",
        points: 45,
        credits: 18
    },
    {
        id: 5,
        title: "Organize Community Cleanup",
        description: "Organize a small community cleanup event (minimum 5 participants)",
        points: 100,
        credits: 40
    },
    {
        id: 6,
        title: "Create Recycling Awareness",
        description: "Create and share an educational post about recycling on social media",
        points: 30,
        credits: 12
    },
    {
        id: 7,
        title: "Upcycling Project",
        description: "Create something useful from waste materials",
        points: 55,
        credits: 22
    },
    {
        id: 8,
        title: "Metal Collection",
        description: "Collect 1kg of recyclable metal items",
        points: 50,
        credits: 20
    },
    {
        id: 9,
        title: "Reduce Plastic Day",
        description: "Go one full day without using any single-use plastic items",
        points: 35,
        credits: 15
    },
    {
        id: 10,
        title: "Composting",
        description: "Start a small composting bin with kitchen waste",
        points: 45,
        credits: 18
    },
    {
        id: 11,
        title: "Beach/River Cleanup",
        description: "Participate in or organize a water body cleanup",
        points: 80,
        credits: 32
    },
    {
        id: 12,
        title: "Recycling Workshop",
        description: "Attend or organize a recycling workshop",
        points: 70,
        credits: 28
    },
    {
        id: 13,
        title: "Green Transportation",
        description: "Use public transport or bicycle for a day instead of private vehicle",
        points: 40,
        credits: 16
    },
    {
        id: 14,
        title: "Textile Recycling",
        description: "Collect and donate 2kg of old clothes for recycling",
        points: 45,
        credits: 18
    },
    {
        id: 15,
        title: "Zero Waste Shopping",
        description: "Complete your grocery shopping using only reusable bags",
        points: 35,
        credits: 14
    },
    {
        id: 16,
        title: "Battery Collection",
        description: "Collect and properly dispose of used batteries",
        points: 50,
        credits: 20
    },
    {
        id: 17,
        title: "Recycling Bin Setup",
        description: "Set up proper recycling bins in your community",
        points: 65,
        credits: 26
    },
    {
        id: 18,
        title: "Educational Video",
        description: "Create a short video about recycling tips",
        points: 55,
        credits: 22
    },
    {
        id: 19,
        title: "Recycling Survey",
        description: "Conduct a recycling awareness survey in your neighborhood",
        points: 60,
        credits: 24
    },
    {
        id: 20,
        title: "Tree Planting",
        description: "Plant a tree and maintain it",
        points: 75,
        credits: 30
    }
];

// Function to get tasks from localStorage or initialize if not exists
function initializeTasks() {
    const storedTasks = localStorage.getItem('taskDatabase');
    if (!storedTasks) {
        localStorage.setItem('taskDatabase', JSON.stringify(window.taskDatabase));
    } else {
        window.taskDatabase = JSON.parse(storedTasks);
    }
}

// Initialize when the script loads
initializeTasks(); 