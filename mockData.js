export const mockUser = {
    login: "igorrm19",
    id: 123456,
    avatar_url: "https://avatars.githubusercontent.com/u/1010101?v=4",
    html_url: "https://github.com/igorrm19",
    name: "Igor M.",
    company: null,
    blog: "https://portfolio.com",
    location: "Brazil",
    email: null,
    bio: "Full Stack Developer | JavaScript Enthusiast",
    public_repos: 15,
    followers: 42,
    following: 10,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
};

export const mockRepos = [
    {
        id: 1,
        name: "awesome-styler",
        html_url: "https://github.com/igorrm19/awesome-styler",
        description: "A tool to style your web apps dynamically.",
        fork: false,
        language: "JavaScript",
        stargazers_count: 5,
        updated_at: "2023-10-15T12:00:00Z",
        topics: ["css", "javascript", "web"]
    },
    {
        id: 2,
        name: "react-clone",
        html_url: "https://github.com/igorrm19/react-clone",
        description: "A minimal clone of React for learning purposes.",
        fork: false,
        language: "JavaScript",
        stargazers_count: 12,
        updated_at: "2023-11-20T10:30:00Z",
        topics: ["react", "library"]
    },
    {
        id: 3,
        name: "forked-repo-example",
        html_url: "https://github.com/igorrm19/forked-repo-example",
        description: "This is a forked repo and should be hidden.",
        fork: true,
        language: "Python",
        stargazers_count: 0,
        updated_at: "2022-05-01T08:00:00Z",
        topics: []
    },
    {
        id: 4,
        name: "portfolio-v1",
        html_url: "https://github.com/igorrm19/portfolio-v1",
        description: null, // Testing null description
        fork: false,
        language: "HTML",
        stargazers_count: 2,
        updated_at: "2021-08-15T14:45:00Z",
        topics: ["portfolio"]
    },
    {
        id: 5,
        name: "api-manager",
        html_url: "https://github.com/igorrm19/api-manager",
        description: "Manages heavy API traffic.",
        fork: false,
        language: "TypeScript",
        stargazers_count: 8,
        updated_at: "2023-12-05T09:15:00Z",
        topics: ["api", "backend"]
    },
    {
        id: 6,
        name: "game-engine-light",
        html_url: "https://github.com/igorrm19/game-engine-light",
        description: "Lightweight game engine for browser games.",
        fork: false,
        language: "JavaScript",
        stargazers_count: 25,
        updated_at: "2023-12-25T16:20:00Z",
        topics: ["game-dev", "canvas"]
    }
];
