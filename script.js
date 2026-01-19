import { mockUser, mockRepos, mockReadme } from './mockData.js';

const IS_DEV_MODE = false;
let currentUsername = 'igorrm19';
const BASE_API_URL = 'https://api.github.com/users';
const REPO_API_URL = 'https://api.github.com/repos';

const profileSection = document.getElementById('profile-section');
const reposGrid = document.getElementById('repos-grid');
const reposSection = document.getElementById('repos-section');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const btnProfile = document.getElementById('btn-profile');
const btnRepos = document.getElementById('btn-repos');

async function fetchData(endpoint) {
    if (IS_DEV_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (endpoint === 'user') return mockUser;
        if (endpoint === 'repos') return mockRepos;
        if (endpoint === 'readme') return mockReadme;
        return null;
    }

    try {
        let url;
        let headers = {};

        if (endpoint === 'user') {
            url = `${BASE_API_URL}/${currentUsername}`;
        } else if (endpoint === 'repos') {
            url = `${BASE_API_URL}/${currentUsername}/repos?sort=updated&per_page=100`;
        } else if (endpoint === 'readme') {
            // README do repositório especial (username/username)
            url = `${REPO_API_URL}/${currentUsername}/${currentUsername}/readme`;
            headers = { 'Accept': 'application/vnd.github.html' };
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            // Se o README não existir (404), apenas retornamos null sem erro crítico
            if (endpoint === 'readme' && response.status === 404) {
                return null;
            }
            if (response.status === 403) {
                throw new Error('Limite da API excedido. Tente novamente mais tarde.');
            }
            if (response.status === 404) {
                if (endpoint === 'user') throw new Error('Usuário não encontrado.');
                return null;
            }
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        if (endpoint === 'readme') {
            return await response.text(); // README vem como HTML text
        }

        return await response.json();
    } catch (error) {
        console.error(`Erro na busca (${endpoint}):`, error);
        if (endpoint === 'readme') return null; // Falha no readme não quebra o app
        throw error;
    }
}

function renderProfile(userData, readmeContent) {
    // Limpar apenas o conteúdo, mantendo estrutura se possível, mas aqui vamos reconstruir
    // Como mudamos a estrutura no HTML para ter profile-header e profile__readme, vamos renderizar dentro deles

    // Recriar estrutura base se limparmos tudo
    profileSection.innerHTML = '';

    const profileHeader = document.createElement('div');
    profileHeader.className = 'profile-header';

    const readmeContainer = document.createElement('div');
    readmeContainer.className = 'profile__readme';
    readmeContainer.id = 'readme-container';

    if (!userData) {
        renderError(profileSection, "Nenhum dado de usuário encontrado.");
        return;
    }

    // -- Avatar --
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'profile__avatar';
    const avatarImg = document.createElement('img');
    avatarImg.src = userData.avatar_url;
    avatarImg.alt = userData.login;
    avatarDiv.appendChild(avatarImg);

    // -- Info --
    const infoDiv = document.createElement('div');
    infoDiv.className = 'profile__info';

    const name = document.createElement('h1');
    name.textContent = userData.name || userData.login;
    name.className = 'profile__name';
    infoDiv.appendChild(name);

    const login = document.createElement('p');
    login.textContent = `@${userData.login}`;
    login.className = 'profile__login';
    infoDiv.appendChild(login);

    if (userData.bio) {
        const bio = document.createElement('p');
        bio.textContent = userData.bio;
        bio.className = 'profile__bio';
        infoDiv.appendChild(bio);
    }

    const statsDiv = document.createElement('div');
    statsDiv.className = 'profile__stats';

    const createStat = (icon, text) => {
        const stat = document.createElement('span');
        stat.className = 'profile__stat-item';
        stat.textContent = `${icon} ${text}`;
        return stat;
    };

    if (userData.location) {
        statsDiv.appendChild(createStat('📍', userData.location));
    }

    statsDiv.appendChild(createStat('👥', `${userData.followers} seguidores`));
    statsDiv.appendChild(createStat('❤️', `${userData.following} seguindo`));

    infoDiv.appendChild(statsDiv);

    if (userData.blog) {
        const link = document.createElement('a');
        let href = userData.blog;
        if (!href.startsWith('http')) href = 'https://' + href;
        link.href = href;
        link.textContent = '🔗 Website';
        link.target = '_blank';
        link.className = 'profile__link';
        infoDiv.appendChild(link);
    }

    profileHeader.appendChild(avatarDiv);
    profileHeader.appendChild(infoDiv);

    profileSection.appendChild(profileHeader);

    // -- Readme --
    if (readmeContent) {
        readmeContainer.innerHTML = readmeContent; // GitHub HTML is safe
        readmeContainer.classList.remove('hidden');
        profileSection.appendChild(readmeContainer);
    }
}

function renderRepos(reposData) {
    reposGrid.innerHTML = '';

    if (!reposData || !Array.isArray(reposData)) {
        renderError(reposGrid, "Falha ao carregar repositórios.");
        return;
    }

    const filteredRepos = reposData.filter(repo => repo.fork === false);

    if (filteredRepos.length === 0) {
        reposGrid.innerHTML = '<p>Nenhum repositório público encontrado.</p>';
        return;
    }

    filteredRepos.forEach(repo => {
        const card = document.createElement('article');
        card.className = 'repo-card';

        const header = document.createElement('div');
        header.className = 'repo-card__header';

        const titleLink = document.createElement('a');
        titleLink.href = repo.html_url;
        titleLink.target = '_blank';
        titleLink.textContent = repo.name;
        titleLink.className = 'repo-card__title';
        header.appendChild(titleLink);

        const badge = document.createElement('span');
        badge.textContent = 'Public';
        badge.className = 'repo-card__badge';
        header.appendChild(badge);

        card.appendChild(header);

        const desc = document.createElement('p');
        desc.textContent = repo.description || 'Sem descrição disponível.';
        desc.className = 'repo-card__description';
        card.appendChild(desc);

        const footer = document.createElement('div');
        footer.className = 'repo-card__footer';

        if (repo.language) {
            const lang = document.createElement('span');
            lang.className = 'repo-card__lang';

            const langColor = document.createElement('span');
            langColor.className = 'repo-card__lang-color';

            lang.appendChild(langColor);
            lang.appendChild(document.createTextNode(repo.language));
            footer.appendChild(lang);
        }

        const stars = document.createElement('span');
        stars.className = 'repo-card__stars';
        stars.textContent = `⭐ ${repo.stargazers_count}`;
        footer.appendChild(stars);

        card.appendChild(footer);

        reposGrid.appendChild(card);
    });
}

function renderError(container, message) {
    container.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `⚠️ ${message}`;
    container.appendChild(errorDiv);
}

function showSection(section) {
    if (section === 'profile') {
        profileSection.classList.remove('hidden');
        reposSection.classList.add('hidden');
        btnProfile.classList.add('active');
        btnRepos.classList.remove('active');
    } else {
        profileSection.classList.add('hidden');
        reposSection.classList.remove('hidden');
        btnProfile.classList.remove('active');
        btnRepos.classList.add('active');
    }
}

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    currentUsername = query;
    await init();
}

async function init() {
    try {
        const loadingHtml = '<div class="loading">Carregando...</div>';
        profileSection.innerHTML = loadingHtml;
        reposGrid.innerHTML = loadingHtml;

        const [userData, reposData, readmeData] = await Promise.all([
            fetchData('user'),
            fetchData('repos'),
            fetchData('readme')
        ]);

        renderProfile(userData, readmeData);
        renderRepos(reposData);

        showSection('profile');

    } catch (error) {
        console.error("Initialization failed:", error);

        const main = document.getElementById('main');
        main.innerHTML = '';

        const errorContainer = document.createElement('div');
        errorContainer.className = 'fatal-error';

        const title = document.createElement('h2');
        title.textContent = 'Algo deu errado';
        errorContainer.appendChild(title);

        const msg = document.createElement('p');
        msg.textContent = "Não foi possível carregar os dados. Verifique sua conexão ou tente novamente mais tarde.";
        errorContainer.appendChild(msg);

        const details = document.createElement('p');
        details.className = 'error-details';
        details.textContent = error.message;
        errorContainer.appendChild(details);

        main.appendChild(errorContainer);
    }
}

btnProfile.addEventListener('click', () => showSection('profile'));
btnRepos.addEventListener('click', () => showSection('repos'));
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

init();
