// Configurações globais
const ADMIN_PASSWORD = '@TELEcimento2025';
const STORAGE_KEY = 'telecimento_evaluations';

// Frases motivacionais
const motivationalQuotes = [
    "A excelência não é um ato, mas um hábito.",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    "A qualidade nunca é um acidente; é sempre o resultado de um esforço inteligente.",
    "Grandes coisas nunca vêm de zonas de conforto.",
    "O cliente é a razão de existirmos como empresa.",
    "A satisfação do cliente é nossa maior conquista.",
    "Cada feedback é uma oportunidade de crescimento.",
    "A excelência no atendimento é nosso compromisso diário.",
    "Juntos construímos um futuro melhor.",
    "Sua opinião nos torna mais fortes.",
    "A inovação nasce da escuta atenta aos nossos clientes.",
    "Qualidade é fazer certo quando ninguém está olhando.",
    "O trabalho em equipe é o combustível que permite pessoas comuns alcançarem resultados incomuns.",
    "A persistência é o caminho do êxito.",
    "Nosso compromisso é superar suas expectativas."
];

// Estado da aplicação
let currentQuoteIndex = 0;
let evaluationData = [];
let isAdminAuthenticated = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadEvaluationData();
    displayRandomQuote();
    setupEventListeners();
}

function setupEventListeners() {
    // Form submission
    document.getElementById('evaluationForm').addEventListener('submit', handleFormSubmission);
    
    // Admin modal events
    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            authenticateAdmin();
        }
    });
    
    // Close modal on overlay click
    document.getElementById('adminModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeAdminModal();
        }
    });
}

// Frases motivacionais
function displayRandomQuote() {
    const quoteElement = document.getElementById('motivationalQuote');
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    currentQuoteIndex = randomIndex;
    
    quoteElement.style.opacity = '0';
    setTimeout(() => {
        quoteElement.textContent = motivationalQuotes[randomIndex];
        quoteElement.style.opacity = '1';
    }, 300);
}

function changeQuote() {
    displayRandomQuote();
}

// Sistema de avaliação
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const evaluation = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        geral: formData.get('geral'),
        vendas: formData.get('vendas'),
        caixa: formData.get('caixa'),
        expedicao: formData.get('expedicao')
    };
    
    // Validar se todos os campos foram preenchidos
    if (!evaluation.geral || !evaluation.vendas || !evaluation.caixa || !evaluation.expedicao) {
        alert('Por favor, avalie todos os setores antes de enviar.');
        return;
    }
    
    // Salvar avaliação
    saveEvaluation(evaluation);
    
    // Mostrar mensagem de sucesso
    showSuccessMessage();
    
    // Resetar formulário
    e.target.reset();
    
    // Mostrar nova frase motivacional
    setTimeout(() => {
        displayRandomQuote();
    }, 2000);
}

function saveEvaluation(evaluation) {
    evaluationData.push(evaluation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluationData));
}

function loadEvaluationData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    evaluationData = stored ? JSON.parse(stored) : [];
}

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Sistema administrativo
function openAdminModal() {
    document.getElementById('adminModal').classList.add('active');
    document.getElementById('adminPassword').focus();
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('active');
    document.getElementById('adminPassword').value = '';
    isAdminAuthenticated = false;
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

function authenticateAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminDashboard();
    } else {
        alert('Senha incorreta!');
        document.getElementById('adminPassword').value = '';
    }
}

function loadAdminDashboard() {
    updateOverviewTab();
    showTab('overview');
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load tab content
    switch(tabName) {
        case 'overview':
            updateOverviewTab();
            break;
        case 'reports':
            updateReportsTab();
            break;
        case 'charts':
            updateChartsTab();
            break;
    }
}

function updateOverviewTab() {
    const totalEvaluations = evaluationData.length;
    document.getElementById('totalEvaluations').textContent = totalEvaluations;
    
    if (totalEvaluations > 0) {
        const overallAverage = calculateOverallAverage();
        document.getElementById('overallAverage').textContent = overallAverage;
        
        updateSectorBreakdowns();
    } else {
        document.getElementById('overallAverage').textContent = '-';
        clearSectorBreakdowns();
    }
}

function calculateOverallAverage() {
    if (evaluationData.length === 0) return '-';
    
    const ratingValues = { 'pessimo': 1, 'regular': 2, 'bom': 3, 'excelente': 4 };
    let totalScore = 0;
    let totalRatings = 0;
    
    evaluationData.forEach(evaluation => {
        totalScore += ratingValues[evaluation.geral] || 0;
        totalScore += ratingValues[evaluation.vendas] || 0;
        totalScore += ratingValues[evaluation.caixa] || 0;
        totalScore += ratingValues[evaluation.expedicao] || 0;
        totalRatings += 4;
    });
    
    const average = totalScore / totalRatings;
    const ratingText = average >= 3.5 ? 'Excelente' : 
                     average >= 2.5 ? 'Bom' : 
                     average >= 1.5 ? 'Regular' : 'Péssimo';
    
    return `${average.toFixed(1)} (${ratingText})`;
}

function updateSectorBreakdowns() {
    const sectors = ['geral', 'vendas', 'caixa', 'expedicao'];
    const ratingLabels = {
        'pessimo': { emoji: '😤', label: 'Péssimo' },
        'regular': { emoji: '🤔', label: 'Regular' },
        'bom': { emoji: '👍', label: 'Bom' },
        'excelente': { emoji: '⭐', label: 'Excelente' }
    };
    
    sectors.forEach(sector => {
        const breakdown = calculateSectorBreakdown(sector);
        const container = document.getElementById(sector + 'Breakdown');
        
        container.innerHTML = '';
        
        Object.keys(ratingLabels).forEach(rating => {
            const count = breakdown[rating] || 0;
            const item = document.createElement('div');
            item.className = 'rating-item';
            item.innerHTML = `
                <span class="rating-label">
                    <span>${ratingLabels[rating].emoji}</span>
                    <span>${ratingLabels[rating].label}</span>
                </span>
                <span class="rating-count">${count}</span>
            `;
            container.appendChild(item);
        });
    });
}

function calculateSectorBreakdown(sector) {
    const breakdown = { 'pessimo': 0, 'regular': 0, 'bom': 0, 'excelente': 0 };
    
    evaluationData.forEach(evaluation => {
        const rating = evaluation[sector];
        if (rating && breakdown.hasOwnProperty(rating)) {
            breakdown[rating]++;
        }
    });
    
    return breakdown;
}

function clearSectorBreakdowns() {
    const sectors = ['geral', 'vendas', 'caixa', 'expedicao'];
    sectors.forEach(sector => {
        document.getElementById(sector + 'Breakdown').innerHTML = '<p style="color: #888;">Nenhuma avaliação ainda</p>';
    });
}

function updateReportsTab() {
    const reportContent = document.getElementById('detailedReport');
    
    if (evaluationData.length === 0) {
        reportContent.textContent = 'Nenhuma avaliação registrada ainda.';
        return;
    }
    
    let report = `RELATÓRIO DETALHADO DE AVALIAÇÕES - TELECIMENTO\n`;
    report += `${'='.repeat(60)}\n\n`;
    report += `Data de Geração: ${new Date().toLocaleString('pt-BR')}\n`;
    report += `Total de Avaliações: ${evaluationData.length}\n\n`;
    
    // Estatísticas gerais
    report += `ESTATÍSTICAS GERAIS\n`;
    report += `${'-'.repeat(30)}\n`;
    
    const sectors = [
        { key: 'geral', name: 'Setor Geral da Empresa' },
        { key: 'vendas', name: 'Setor de Vendas' },
        { key: 'caixa', name: 'Setor de Caixa' },
        { key: 'expedicao', name: 'Setor de Expedição' }
    ];
    
    sectors.forEach(sector => {
        const breakdown = calculateSectorBreakdown(sector.key);
        const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
        
        report += `\n${sector.name}:\n`;
        report += `  Péssimo: ${breakdown.pessimo} (${total > 0 ? ((breakdown.pessimo/total)*100).toFixed(1) : 0}%)\n`;
        report += `  Regular: ${breakdown.regular} (${total > 0 ? ((breakdown.regular/total)*100).toFixed(1) : 0}%)\n`;
        report += `  Bom: ${breakdown.bom} (${total > 0 ? ((breakdown.bom/total)*100).toFixed(1) : 0}%)\n`;
        report += `  Excelente: ${breakdown.excelente} (${total > 0 ? ((breakdown.excelente/total)*100).toFixed(1) : 0}%)\n`;
    });
    
    // Histórico de avaliações
    report += `\n\nHISTÓRICO DE AVALIAÇÕES\n`;
    report += `${'-'.repeat(30)}\n`;
    
    evaluationData.slice(-10).reverse().forEach((evaluation, index) => {
        const date = new Date(evaluation.timestamp).toLocaleString('pt-BR');
        report += `\n${index + 1}. ${date}\n`;
        report += `   Geral: ${evaluation.geral} | Vendas: ${evaluation.vendas} | Caixa: ${evaluation.caixa} | Expedição: ${evaluation.expedicao}\n`;
    });
    
    if (evaluationData.length > 10) {
        report += `\n... e mais ${evaluationData.length - 10} avaliações anteriores.\n`;
    }
    
    reportContent.textContent = report;
}

function updateChartsTab() {
    const canvas = document.getElementById('evaluationChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (evaluationData.length === 0) {
        ctx.fillStyle = '#888';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhuma avaliação para exibir', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Prepare data
    const sectors = ['geral', 'vendas', 'caixa', 'expedicao'];
    const sectorNames = ['Geral', 'Vendas', 'Caixa', 'Expedição'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    
    // Calculate averages for each sector
    const ratingValues = { 'pessimo': 1, 'regular': 2, 'bom': 3, 'excelente': 4 };
    const averages = sectors.map(sector => {
        const total = evaluationData.reduce((sum, evaluation) => {
            return sum + (ratingValues[evaluation[sector]] || 0);
        }, 0);
        return total / evaluationData.length;
    });
    
    // Draw bar chart
    const barWidth = 60;
    const barSpacing = 80;
    const maxHeight = 150;
    const startX = 50;
    const startY = canvas.height - 50;
    
    // Draw bars
    averages.forEach((average, index) => {
        const barHeight = (average / 4) * maxHeight;
        const x = startX + index * barSpacing;
        const y = startY - barHeight;
        
        // Draw bar
        ctx.fillStyle = colors[index];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw value on top
        ctx.fillStyle = '#fff';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(average.toFixed(1), x + barWidth / 2, y - 5);
        
        // Draw sector name
        ctx.fillText(sectorNames[index], x + barWidth / 2, startY + 20);
    });
    
    // Draw title
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Média de Avaliação por Setor', canvas.width / 2, 30);
    
    // Draw scale
    ctx.fillStyle = '#888';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const y = startY - (i / 4) * maxHeight;
        ctx.fillText(i.toString(), startX - 10, y + 3);
    }
}

function exportReport() {
    updateReportsTab();
    const reportContent = document.getElementById('detailedReport').textContent;
    
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-telecimento-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleString('pt-BR');
}

// Debug functions (remove in production)
function addTestData() {
    const testEvaluations = [
        { id: 1, timestamp: new Date().toISOString(), geral: 'bom', vendas: 'excelente', caixa: 'bom', expedicao: 'regular' },
        { id: 2, timestamp: new Date().toISOString(), geral: 'excelente', vendas: 'bom', caixa: 'excelente', expedicao: 'bom' },
        { id: 3, timestamp: new Date().toISOString(), geral: 'regular', vendas: 'bom', caixa: 'regular', expedicao: 'pessimo' },
        { id: 4, timestamp: new Date().toISOString(), geral: 'bom', vendas: 'regular', caixa: 'bom', expedicao: 'excelente' },
        { id: 5, timestamp: new Date().toISOString(), geral: 'excelente', vendas: 'excelente', caixa: 'bom', expedicao: 'bom' }
    ];
    
    evaluationData = [...evaluationData, ...testEvaluations];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluationData));
    console.log('Dados de teste adicionados!');
}

// Uncomment the line below to add test data for development
// addTestData();

