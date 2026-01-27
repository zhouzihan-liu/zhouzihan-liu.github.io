// 数据中心：个人资料与基础配置
window.SiteData = window.SiteData || {};

window.SiteData.profile = {
    name: "Your Name",
    // 允许使用HTML标签，如 <br> 换行
    title: "Building Interpretable<br><span class=\"text-light\">Machine Intelligence.</span>",
    bio: "I research the intersection of computer vision and reasoning, focusing on geometric priors and self-supervised learning to create AI systems that understand the physical world.",
    // 头像路径
    photo: "assets/images/profile.jpg",
    // 侧边栏信息
    specs: [
        { label: "ROLE", value: "Ph.D. Candidate" },
        { label: "AFFILIATION", value: "Univ. of Innovation" },
        { label: "STATUS", value: "Available 2026", active: true }
    ]
};

window.SiteData.nav = [
    { label: "About", href: "#about" },
    { label: "News", href: "#news" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" }
];

window.SiteData.honors = {
    title: "Honors",
    items: [
        { year: "2026", title: "NVIDIA Graduate Fellowship", org: "NVIDIA Research" },
        { year: "2026", title: "CVPR Best Student Paper Award", org: "IEEE Computer Society" },
        { year: "2025", title: "Outstanding Reviewer", org: "NeurIPS 2025" },
        { year: "2024", title: "National Scholarship", org: "Ministry of Education" }
    ]
};

window.SiteData.experience = {
    title: "Timeline",
    items: [
        { date: "2024 — NOW", role: "Research Assistant", location: "University of Innovation" },
        { date: "SUMMER 2024", role: "Research Intern", location: "NVIDIA Research" }
    ]
};

window.SiteData.footer = {
    copyright: "© 2026 Your Name",
    links: [
        { label: "Email", url: "mailto:email@example.com" },
        { label: "Google Scholar", url: "#" },
        { label: "GitHub", url: "#" },
        { label: "Twitter", url: "#" }
    ]
};
