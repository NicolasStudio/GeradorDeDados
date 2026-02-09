// PDF Reader Script - Versão Corrigida com Volume Funcional
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const dropArea = document.getElementById('dropArea');
    const pdfInput = document.getElementById('pdfInput');
    const pdfInfo = document.getElementById('pdfInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const pageCount = document.getElementById('pageCount');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const processBtn = document.getElementById('processBtn');
    const controlsContainer = document.getElementById('controlsContainer');
    const voiceSelect = document.getElementById('voiceSelect');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    const volumeSlider = document.getElementById('volumeSlider');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');
    const textContent = document.getElementById('textContent');
    
    // Variáveis de estado
    let pdfDoc = null;
    let extractedText = '';
    let sentences = [];
    let currentSentenceIndex = 0;
    let isPlaying = false;
    let isPaused = false;
    let speechSynthesis = window.speechSynthesis;
    let voices = [];
    let selectedVoice = null;
    let currentUtterance = null;
    let pdfjsLib = null;
    let isStopping = false;
    let isErrorModalVisible = false;
    let isUserAction = false;
    let currentVolume = 1; // Valor atual do volume
    let currentSpeed = 1;  // Valor atual da velocidade
    
    // Inicialização
    initVoices();
    setupEventListeners();
    loadPDFJS();
    
    // Carregar PDF.js dinamicamente
    function loadPDFJS() {
        if (typeof window.pdfjsLib === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = function() {
                pdfjsLib = window.pdfjsLib;
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            };
            script.onerror = function() {
                showError('Não foi possível carregar a biblioteca PDF.js. Verifique sua conexão com a internet.', true);
            };
            document.head.appendChild(script);
        } else {
            pdfjsLib = window.pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
    }
    
    // Configurar listeners de eventos
    function setupEventListeners() {
        // Upload de arquivo
        pdfInput.addEventListener('change', handleFileSelect);
        
        // Drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        dropArea.addEventListener('drop', handleDrop, false);
        dropArea.addEventListener('click', () => pdfInput.click());
        
        // Processar PDF
        processBtn.addEventListener('click', processPDF);
        
        // Controles de voz
        voiceSelect.addEventListener('change', updateVoice);
        speedSlider.addEventListener('input', handleSpeedChange);
        volumeSlider.addEventListener('input', handleVolumeChange);
        
        // Controles de reprodução
        playBtn.addEventListener('click', () => {
            isUserAction = true;
            togglePlay();
        });
        pauseBtn.addEventListener('click', () => {
            isUserAction = true;
            togglePause();
        });
        stopBtn.addEventListener('click', () => {
            isUserAction = true;
            stopPlayback();
        });
        prevBtn.addEventListener('click', () => {
            isUserAction = true;
            playPrevious();
        });
        nextBtn.addEventListener('click', () => {
            isUserAction = true;
            playNext();
        });
        
        // Fechar erro quando clicar no X
        const closeErrorBtn = document.createElement('button');
        closeErrorBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeErrorBtn.style.cssText = 'background: none; border: none; color: inherit; cursor: pointer; margin-left: auto; padding: 0 5px;';
        closeErrorBtn.addEventListener('click', hideError);
        errorMessage.appendChild(closeErrorBtn);
        
        // Atualizar lista de vozes quando mudar
        speechSynthesis.onvoiceschanged = initVoices;
        
        // Resetar flag de ação do usuário após um tempo
        setInterval(() => {
            isUserAction = false;
        }, 100);
    }
    
    // Prevenir comportamentos padrão do drag and drop
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }
    
    // Lidar com arquivo arrastado
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }
    
    // Lidar com seleção de arquivo
    function handleFileSelect(e) {
        const files = e.target.files;
        
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }
    
    // Processar arquivo
    function handleFile(file) {
        // Verificar se é PDF
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            showError('Por favor, selecione um arquivo PDF válido.', false);
            return;
        }
        
        // Limpar estado anterior
        resetState();
        
        // Mostrar informações do arquivo
        showFileInfo(file);
        
        // Preparar para processamento
        processBtn.disabled = false;
        
        hideError();
    }
    
    // Mostrar informações do arquivo
    function showFileInfo(file) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        pdfInfo.classList.add('show');
    }
    
    // Formatar tamanho do arquivo
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Processar PDF
    async function processPDF() {
        if (!pdfInput.files[0]) return;
        
        // Verificar se PDF.js está carregado
        if (!pdfjsLib) {
            showError('A biblioteca PDF.js ainda está carregando. Aguarde alguns instantes e tente novamente.', false);
            setStatus('Aguardando biblioteca...', 'error');
            return;
        }
        
        setStatus('Processando PDF...', 'processing');
        processBtn.disabled = true;
        
        try {
            const file = pdfInput.files[0];
            const arrayBuffer = await file.arrayBuffer();
            
            // Carregar PDF
            pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            // Atualizar contagem de páginas
            pageCount.textContent = pdfDoc.numPages;
            
            // Extrair texto
            extractedText = await extractTextFromPDF(pdfDoc);
            
            // Processar texto em frases
            sentences = splitIntoSentences(extractedText);
            
            // Mostrar controles
            controlsContainer.classList.add('show');
            
            // Exibir texto
            displayText();
            
            // Habilitar controles de reprodução
            updatePlaybackControls();
            
            setStatus(`PDF processado! ${sentences.length} frases extraídas`, 'success');
            
        } catch (error) {
            console.error('Erro ao processar PDF:', error);
            showError('Erro ao processar o PDF. Certifique-se de que o arquivo é válido e não está corrompido.', false);
            setStatus('Erro no processamento', 'error');
            processBtn.disabled = false;
        }
    }
    
    // Extrair texto do PDF
    async function extractTextFromPDF(pdfDoc) {
        let fullText = '';
        
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText;
    }
    
    // Dividir texto em frases
    function splitIntoSentences(text) {
        if (!text || text.trim() === '') {
            return [];
        }
        
        // Regex melhorada para dividir em frases
        const sentenceRegex = /[^.!?\n]+[.!?]+|[^.!?\n]+$/g;
        let sentences = text.match(sentenceRegex) || [];
        
        // Filtrar e limpar frases
        sentences = sentences
            .map(s => s.trim())
            .filter(s => s.length > 3 && !s.match(/^\s*$/))
            .map(s => s.replace(/\s+/g, ' ')); // Remover múltiplos espaços
        
        // Se não encontrou frases com pontuação, dividir por quebras de linha
        if (sentences.length === 0) {
            sentences = text.split('\n')
                .map(s => s.trim())
                .filter(s => s.length > 3);
        }
        
        return sentences;
    }
    
    // Exibir texto extraído
    function displayText() {
        if (sentences.length === 0) {
            textContent.innerHTML = '<p class="text-placeholder">Nenhum texto extraído do PDF. O documento pode estar protegido ou conter apenas imagens.</p>';
            return;
        }
        
        let html = '';
        
        // Mostrar as frases atuais com contexto
        const startIndex = Math.max(0, currentSentenceIndex - 2);
        const endIndex = Math.min(sentences.length, currentSentenceIndex + 8);
        const displaySentences = sentences.slice(startIndex, endIndex);
        
        displaySentences.forEach((sentence, index) => {
            const actualIndex = startIndex + index;
            const sentenceClass = actualIndex === currentSentenceIndex ? 'current-sentence' : '';
            const sentenceNumber = actualIndex + 1;
            html += `<p class="${sentenceClass}" data-index="${actualIndex}">${sentenceNumber}. ${sentence}</p>`;
        });
        
        if (sentences.length > endIndex) {
            html += `<p class="text-placeholder">... e mais ${sentences.length - endIndex} frases</p>`;
        }
        
        textContent.innerHTML = html;
        
        // Scroll para a frase atual
        setTimeout(() => {
            const currentElement = textContent.querySelector('.current-sentence');
            if (currentElement) {
                currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
    
    // Inicializar vozes disponíveis
    function initVoices() {
        voices = speechSynthesis.getVoices();
        
        // Limpar opções anteriores
        voiceSelect.innerHTML = '';
        
        if (voices.length === 0) {
            voiceSelect.innerHTML = '<option value="">Nenhuma voz disponível</option>';
            
            // Tentar novamente após um tempo
            setTimeout(initVoices, 1000);
            return;
        }
        
        // Filtrar vozes em português (prioridade)
        const portugueseVoices = voices.filter(voice => 
            voice.lang.includes('pt') || voice.lang.includes('PT')
        );
        
        const otherVoices = voices.filter(voice => 
            !voice.lang.includes('pt') && !voice.lang.includes('PT')
        );
        
        // Adicionar vozes em português primeiro
        if (portugueseVoices.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = 'Vozes em Português';
            
            portugueseVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                optgroup.appendChild(option);
            });
            
            voiceSelect.appendChild(optgroup);
            
            // Selecionar primeira voz em português por padrão
            selectedVoice = portugueseVoices[0];
            voiceSelect.value = selectedVoice.name;
        }
        
        // Adicionar outras vozes
        if (otherVoices.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = 'Outras Vozes';
            
            otherVoices.forEach(voice => {
                const option = document.createElement('option');
                option.value = voice.name;
                option.textContent = `${voice.name} (${voice.lang})`;
                optgroup.appendChild(option);
            });
            
            voiceSelect.appendChild(optgroup);
        }
        
        // Se não selecionou voz ainda, usar a primeira disponível
        if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices[0];
            voiceSelect.value = selectedVoice.name;
        }
    }
    
    // Atualizar voz selecionada
    function updateVoice() {
        const voiceName = voiceSelect.value;
        selectedVoice = voices.find(voice => voice.name === voiceName);
        
        // Se estiver tocando, recomeçar com nova voz
        if (isPlaying && !isPaused) {
            restartCurrentSentence('voz alterada');
        }
    }
    
    // Lidar com mudança de velocidade
    function handleSpeedChange() {
        const speed = parseFloat(speedSlider.value);
        speedValue.textContent = `${speed.toFixed(1)}x`;
        currentSpeed = speed;
        
        // Aplicar imediatamente se estiver tocando
        if (isPlaying && !isPaused) {
            restartCurrentSentence('velocidade alterada');
        }
    }
    
    // Lidar com mudança de volume
    function handleVolumeChange() {
        const volume = parseFloat(volumeSlider.value);
        currentVolume = volume;
        
        // Atualizar visualmente o ícone de volume
        updateVolumeIcon(volume);
        
        // Aplicar imediatamente se estiver tocando
        if (isPlaying && !isPaused && currentUtterance) {
            // Tenta atualizar o volume dinamicamente
            try {
                currentUtterance.volume = volume;
                
                // Para alguns navegadores, precisamos forçar a atualização
                if (speechSynthesis.speaking) {
                    // Esta técnica funciona melhor para atualização de volume
                    const wasPaused = isPaused;
                    if (!wasPaused) {
                        speechSynthesis.pause();
                        setTimeout(() => {
                            speechSynthesis.resume();
                        }, 10);
                    }
                }
            } catch (e) {
                restartCurrentSentence('volume alterado');
            }
        }
    }
    
    // Atualizar ícone do volume baseado no valor
    function updateVolumeIcon(volume) {
        const volumeIcon = document.querySelector('.volume-control i');
        if (!volumeIcon) return;
        
        if (volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (volume < 0.3) {
            volumeIcon.className = 'fas fa-volume-off';
        } else if (volume < 0.7) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }
    
    // Reiniciar a frase atual (para aplicar mudanças)
    function restartCurrentSentence(reason = '') {
        if (!isPlaying || sentences.length === 0) return;
        
        const wasPlaying = isPlaying && !isPaused;
        const currentIndex = currentSentenceIndex;
        
        if (wasPlaying) {
            speechSynthesis.cancel();
            setTimeout(() => {
                currentSentenceIndex = currentIndex;
                playCurrentSentence();
            }, 50);
        }
    }
    
    // Alternar reprodução
    function togglePlay() {
        if (isPlaying && !isPaused) {
            // Pausar imediatamente
            speechSynthesis.pause();
            isPaused = true;
            updatePlaybackControls();
            setStatus('Pausado', 'paused');
        } else if (isPlaying && isPaused) {
            // Retomar
            speechSynthesis.resume();
            isPaused = false;
            updatePlaybackControls();
            setStatus('Reproduzindo...', 'playing');
        } else {
            // Iniciar nova leitura
            playCurrentSentence();
        }
    }
    
    // Alternar pausa
    function togglePause() {
        if (isPlaying && !isPaused) {
            speechSynthesis.pause();
            isPaused = true;
            updatePlaybackControls();
            setStatus('Pausado', 'paused');
        } else if (isPlaying && isPaused) {
            speechSynthesis.resume();
            isPaused = false;
            updatePlaybackControls();
            setStatus('Reproduzindo...', 'playing');
        }
    }
    
    // Parar reprodução IMEDIATAMENTE
    function stopPlayback() {
        if (isPlaying) {
            isStopping = true;
            speechSynthesis.cancel();
            isPlaying = false;
            isPaused = false;
            currentSentenceIndex = 0;
            updatePlaybackControls();
            updateProgress();
            displayText();
            setStatus('Parado', 'stopped');
            
            setTimeout(() => {
                isStopping = false;
            }, 100);
        }
    }
    
    // Reproduzir frase anterior (sem recomeçar a frase atual)
    function playPrevious() {
        if (currentSentenceIndex > 0) {
            isUserAction = true;
            speechSynthesis.cancel();
            currentSentenceIndex = Math.max(0, currentSentenceIndex - 1);
            playCurrentSentence();
        }
    }
    
    // Reproduzir próxima frase (pular a atual)
    function playNext() {
        if (currentSentenceIndex < sentences.length - 1) {
            isUserAction = true;
            speechSynthesis.cancel();
            currentSentenceIndex = Math.min(sentences.length - 1, currentSentenceIndex + 1);
            playCurrentSentence();
        } else if (currentSentenceIndex === sentences.length - 1) {
            // Se já está na última frase, parar
            stopPlayback();
        }
    }
    
    // Reproduzir frase atual
    function playCurrentSentence() {
        if (sentences.length === 0 || currentSentenceIndex >= sentences.length) {
            showError('Nenhum texto disponível para leitura.', false);
            return;
        }
        
        // Cancelar qualquer reprodução em andamento
        if (currentUtterance) {
            speechSynthesis.cancel();
        }
        
        // Criar novo utterance
        const sentence = sentences[currentSentenceIndex];
        currentUtterance = new SpeechSynthesisUtterance(sentence);
        
        // Configurar utterance com valores atuais
        if (selectedVoice) {
            currentUtterance.voice = selectedVoice;
        }
        
        currentUtterance.rate = currentSpeed;
        currentUtterance.volume = currentVolume;
        currentUtterance.pitch = 1;
        currentUtterance.lang = selectedVoice ? selectedVoice.lang : 'pt-BR';
        
        // Event listeners do utterance
        currentUtterance.onstart = () => {
            isPlaying = true;
            isPaused = false;
            updatePlaybackControls();
            updateProgress();
            displayText();
            setStatus('Reproduzindo...', 'playing');
        };
        
        currentUtterance.onend = () => {
            // Resetar flag de ação do usuário
            isUserAction = false;
            
            // Verificar se foi uma interrupção intencional
            if (isStopping || isUserAction) {
                return;
            }
            
            // Avançar para próxima frase automaticamente
            if (currentSentenceIndex < sentences.length - 1) {
                currentSentenceIndex++;
                setTimeout(() => playCurrentSentence(), 300);
            } else {
                // Fim do documento
                isPlaying = false;
                isPaused = false;
                updatePlaybackControls();
                setStatus('Leitura concluída!', 'success');
            }
        };
        
        currentUtterance.onerror = (event) => {
            // Ignorar completamente erros "interrupted" 
            if (event.error === 'interrupted') {
                return;
            }
            
            // Ignorar outros erros durante ações do usuário
            if (isUserAction || isStopping) {
                return;
            }
            
            console.error('Erro real na síntese de voz:', event.error);
            isPlaying = false;
            isPaused = false;
            updatePlaybackControls();
            setStatus('Erro na reprodução', 'error');
            
            // Mostrar erro apenas para erros reais
            if (event.error !== 'interrupted' && !isUserAction && !isStopping) {
                showError(`Erro na voz: ${event.error}. Tente selecionar outra voz.`, false);
            }
        };
        
        // Iniciar reprodução
        try {
            speechSynthesis.speak(currentUtterance);
        } catch (error) {
            console.error('Erro ao iniciar síntese de voz:', error);
            showError('Não foi possível iniciar a leitura. Tente novamente.', false);
        }
    }
    
    // Atualizar controles de reprodução
    function updatePlaybackControls() {
        const hasSentences = sentences.length > 0;
        const canPlay = hasSentences && (!isPlaying || isPaused);
        const canPause = hasSentences && isPlaying && !isPaused;
        const canStop = hasSentences && isPlaying;
        const canPrev = hasSentences && currentSentenceIndex > 0;
        const canNext = hasSentences && currentSentenceIndex < sentences.length - 1;
        
        playBtn.disabled = !canPlay;
        pauseBtn.disabled = !canPause;
        stopBtn.disabled = !canStop;
        prevBtn.disabled = !canPrev;
        nextBtn.disabled = !canNext;
        
        // Atualizar ícones
        if (isPlaying && !isPaused) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.title = 'Pausar';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.title = 'Reproduzir';
        }
    }
    
    // Atualizar barra de progresso
    function updateProgress() {
        if (sentences.length === 0) {
            progressBar.style.width = '0%';
            currentTime.textContent = '00:00';
            totalTime.textContent = '00:00';
            return;
        }
        
        const progress = ((currentSentenceIndex + 1) / sentences.length) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Atualizar tempos (estimativa)
        const currentMinutes = Math.floor(currentSentenceIndex / 10);
        const totalMinutes = Math.floor(sentences.length / 10);
        
        currentTime.textContent = formatTime(currentMinutes);
        totalTime.textContent = formatTime(totalMinutes);
    }
    
    // Formatar tempo em minutos:segundos
    function formatTime(minutes) {
        const min = Math.floor(minutes);
        const sec = Math.floor((minutes - min) * 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    
    // Definir status
    function setStatus(message, type = 'info') {
        statusText.textContent = message;
        
        // Resetar classes
        statusDot.className = 'status-dot';
        
        // Adicionar classe baseada no tipo
        switch(type) {
            case 'processing':
                statusDot.classList.add('active');
                statusDot.style.backgroundColor = '#3b82f6';
                break;
            case 'success':
                statusDot.style.backgroundColor = 'var(--cor-destaque)';
                break;
            case 'error':
                statusDot.style.backgroundColor = 'var(--cor-alerta)';
                break;
            case 'playing':
                statusDot.classList.add('active');
                statusDot.style.backgroundColor = 'var(--cor-primaria)';
                break;
            case 'paused':
                statusDot.style.backgroundColor = 'orange';
                break;
            case 'stopped':
                statusDot.style.backgroundColor = 'var(--cor-texto-secundario)';
                break;
            default:
                statusDot.style.backgroundColor = 'var(--cor-texto-secundario)';
        }
    }
    
    // Mostrar erro (com opção de ser fixo ou temporário)
    function showError(message, isPermanent = false) {
        if (isErrorModalVisible) return;
        
        isErrorModalVisible = true;
        errorText.textContent = message;
        errorMessage.classList.add('show');
        
        if (!isPermanent) {
            setTimeout(() => {
                hideError();
            }, 5000);
        }
    }
    
    // Ocultar erro
    function hideError() {
        isErrorModalVisible = false;
        errorMessage.classList.remove('show');
    }
    
    // Resetar estado
    function resetState() {
        isStopping = true;
        if (currentUtterance) {
            speechSynthesis.cancel();
        }
        
        setTimeout(() => {
            isStopping = false;
        }, 100);
        
        pdfDoc = null;
        extractedText = '';
        sentences = [];
        currentSentenceIndex = 0;
        isPlaying = false;
        isPaused = false;
        currentUtterance = null;
        isUserAction = false;
        currentVolume = 1;
        currentSpeed = 1;
        
        // Resetar controles visuais
        speedSlider.value = 1;
        speedValue.textContent = '1.0x';
        volumeSlider.value = 1;
        updateVolumeIcon(1);
        
        controlsContainer.classList.remove('show');
        pdfInfo.classList.remove('show');
        hideError();
        
        pageCount.textContent = '-';
        textContent.innerHTML = '<p class="text-placeholder">O texto extraído do PDF será exibido aqui...</p>';
        
        setStatus('Pronto para processar', 'info');
        updateProgress();
    }
    
    // Verificação de compatibilidade
    function checkCompatibility() {
        if (!('speechSynthesis' in window)) {
            showError('Seu navegador não suporta síntese de voz. Use Chrome, Edge ou Safari.', true);
            processBtn.disabled = true;
        }
        
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            showError('Seu navegador não suporta a API de arquivos necessária.', true);
            processBtn.disabled = true;
        }
    }
    
    // Executar verificação de compatibilidade
    checkCompatibility();
});