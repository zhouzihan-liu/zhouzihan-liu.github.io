// 数据中心：科研成果
window.SiteData = window.SiteData || {};

window.SiteData.works = {
    title: "Research Works",
    limit: 2, // 默认显示前2条，其余折叠
    items: [
        {
            year: "2026",
            venue: "CVPR",
            badge: "Oral",
            badgeColor: "default", // default(yellow) | blue
            title: "Geometric Priors for Efficient Neural Rendering",
            authors: "<strong>Your Name</strong>, Alice Smith, Bob Johnson",
            desc: "Introducing Euclidean bias into NeRFs to reduce training time by 40% while maintaining geometric consistency.",
            links: [
                { label: "PDF", url: "#" },
                { label: "Code", url: "#" }
            ]
        },
        {
            year: "2025",
            venue: "ICLR",
            badge: "Spotlight",
            badgeColor: "blue",
            title: "Unsupervised Discovery of Object Parts",
            authors: "Charlie Brown, <strong>Your Name</strong>, Jane Doe",
            desc: "A self-supervised framework that segments objects into semantic parts without any manual annotation.",
            links: [
                { label: "PDF", url: "#" },
                { label: "Code", url: "#" }
            ]
        },
        {
            year: "2024",
            venue: "NeurIPS",
            title: "Ethical Constraints in Large Language Models",
            authors: "<strong>Your Name</strong>, David Lee",
            desc: "Analyzing the propagation of bias in foundation models and proposing a new reinforcement learning constraint.",
            links: [
                { label: "PDF", url: "#" }
            ]
        },
        {
            year: "2024",
            venue: "ECCV",
            title: "Another Great Paper Title Here",
            authors: "Alice Smith, <strong>Your Name</strong>",
            links: [
                { label: "PDF", url: "#" }
            ]
        }
    ]
};
