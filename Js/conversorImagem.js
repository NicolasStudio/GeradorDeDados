class SimpleImageConverter {
    constructor() {
        this.selectedFiles = [];
        this.selectedFormat = null;
        this.convertedFiles = [];
        
        // Configurar PDF.js se necessário para alguns formatos
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        }
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
    }
    
    bindElements() {
        this.uploadBox = document.getElementById('uploadBox');
        this.fileInput = document.getElementById('simpleFileInput');
        this.selectedFileRow = document.getElementById('selectedFileRow');
        this.filesPreview = document.getElementById('filesPreview');
        this.previewList = document.getElementById('previewList');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.dropdownToggle = document.getElementById('dropdownToggle');
        this.dropdownMenu = document.getElementById('dropdownMenu');
        this.dropdownItems = document.querySelectorAll('.dropdown-item');
        this.selectedFormatText = document.getElementById('selectedFormatText');
        this.formatSearch = document.getElementById('formatSearch');
        this.progressArea = document.getElementById('progressArea');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressPercentage = document.querySelector('.progress-percentage');
        this.progressFilename = document.querySelector('.progress-filename');
        this.toastContainer = document.getElementById('toastContainer');
        this.downloadModal = document.getElementById('downloadModal');
        this.modalMessage = document.getElementById('modalMessage');
        this.downloadList = document.getElementById('downloadList');
        this.downloadAllBtn = document.getElementById('downloadAllBtn');
    }
    
    bindEvents() {
        // Upload
        this.uploadBox.addEventListener('click', () => this.fileInput.click());
        this.uploadBox.addEventListener('dragover', (e) => e.preventDefault());
        this.uploadBox.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Dropdown
        this.dropdownToggle.addEventListener('click', () => {
            this.dropdownMenu.classList.toggle('show');
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.dropdownToggle.contains(e.target) && !this.dropdownMenu.contains(e.target)) {
                this.dropdownMenu.classList.remove('show');
            }
        });
        
        // Selecionar formato
        this.dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                const format = item.dataset.format;
                const formatName = item.querySelector('.item-name').textContent;
                this.selectFormat(format, formatName);
                this.dropdownMenu.classList.remove('show');
            });
        });
        
        // Busca
        if (this.formatSearch) {
            this.formatSearch.addEventListener('input', (e) => {
                this.searchFormats(e.target.value);
            });
        }
        
        // Download all
        if (this.downloadAllBtn) {
            this.downloadAllBtn.addEventListener('click', () => this.downloadAllFiles());
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }
    
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
    }
    
    addFiles(files) {
        // Filtrar apenas imagens
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length === 0) {
            this.showToast('Por favor, selecione apenas arquivos de imagem.', 'error');
            return;
        }
        
        this.selectedFiles = imageFiles;
        
        if (this.selectedFiles.length === 1) {
            // Modo arquivo único
            this.selectedFileRow.style.display = 'flex';
            this.filesPreview.style.display = 'none';
            
            const file = this.selectedFiles[0];
            this.fileName.textContent = file.name;
            this.fileSize.textContent = this.formatFileSize(file.size);
        } else {
            // Modo múltiplos arquivos
            this.selectedFileRow.style.display = 'none';
            this.filesPreview.style.display = 'block';
            this.updatePreviewList();
        }
        
        this.showToast(`${imageFiles.length} arquivo(s) adicionado(s) com sucesso!`, 'success');
    }
    
    updatePreviewList() {
        let html = '';
        this.selectedFiles.forEach((file, index) => {
            html += `
                <div class="preview-item">
                    <span class="file-icon">🖼️</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                    <button class="remove-file" onclick="simpleConverter.removeFile(${index})">✕</button>
                </div>
            `;
        });
        this.previewList.innerHTML = html;
    }
    
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        if (this.selectedFiles.length === 0) {
            this.clearFile();
            this.showToast('Arquivo removido', 'info');
        } else if (this.selectedFiles.length === 1) {
            // Voltar para modo único
            this.selectedFileRow.style.display = 'flex';
            this.filesPreview.style.display = 'none';
            const file = this.selectedFiles[0];
            this.fileName.textContent = file.name;
            this.fileSize.textContent = this.formatFileSize(file.size);
            this.showToast('Arquivo removido', 'info');
        } else {
            this.updatePreviewList();
            this.showToast('Arquivo removido', 'info');
        }
    }
    
    clearFile() {
        this.selectedFiles = [];
        this.selectedFileRow.style.display = 'none';
        this.filesPreview.style.display = 'none';
        this.fileInput.value = '';
    }
    
    clearAllFiles() {
        this.clearFile();
        this.showToast('Todos os arquivos foram removidos', 'info');
    }
    
    selectFormat(format, formatName) {
        this.selectedFormat = format;
        this.selectedFormatText.textContent = formatName;
        
        // Marcar item como selecionado
        this.dropdownItems.forEach(item => {
            item.classList.remove('selected');
            if (item.dataset.format === format) {
                item.classList.add('selected');
            }
        });
        
        this.showToast(`Formato selecionado: ${formatName}`, 'success');
    }
    
    searchFormats(query) {
        const searchTerm = query.toLowerCase();
        this.dropdownItems.forEach(item => {
            const name = item.querySelector('.item-name').textContent.toLowerCase();
            const ext = item.querySelector('.item-ext')?.textContent.toLowerCase() || '';
            
            if (name.includes(searchTerm) || ext.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        this.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
    
    async convert() {
        if (this.selectedFiles.length === 0) {
            this.showToast('Selecione uma imagem primeiro!', 'warning');
            return;
        }
        
        if (!this.selectedFormat) {
            this.showToast('Selecione um formato de saída!', 'warning');
            return;
        }
        
        this.progressArea.style.display = 'block';
        this.convertedFiles = [];
        
        await this.simulateConversion();
    }
    
    async simulateConversion() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    this.progressArea.style.display = 'none';
                    this.createConvertedFiles();
                    this.showDownloadModal();
                }, 500);
            }
            
            this.updateProgress(progress, this.selectedFiles[0]?.name || 'Arquivo');
        }, 200);
    }
    
    createConvertedFiles() {
        this.selectedFiles.forEach((file, index) => {
            // Simular arquivo convertido
            const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.' + this.selectedFormat;
            const blob = new Blob([`Arquivo convertido para ${this.selectedFormat}`], { type: 'application/octet-stream' });
            
            this.convertedFiles.push({
                name: newFileName,
                size: blob.size,
                blob: blob,
                originalName: file.name,
                index: index
            });
        });
    }
    
    updateProgress(percentage, filename) {
        if (this.progressFill) {
            this.progressFill.style.width = `${percentage}%`;
        }
        if (this.progressPercentage) {
            this.progressPercentage.textContent = `${Math.round(percentage)}%`;
        }
        if (this.progressFilename) {
            this.progressFilename.textContent = `Convertendo: ${filename}`;
        }
    }
    
    showDownloadModal() {
        this.modalMessage.textContent = `${this.convertedFiles.length} arquivo(s) convertido(s) com sucesso para ${this.selectedFormat.toUpperCase()}!`;
        
        let downloadHtml = '';
        this.convertedFiles.forEach((file, index) => {
            downloadHtml += `
                <div class="download-item">
                    <span class="download-icon">📥</span>
                    <div class="download-info">
                        <span class="download-name">${file.name}</span>
                        <span class="download-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <button class="download-btn" onclick="simpleConverter.downloadFile(${index})">Download</button>
                </div>
            `;
        });
        
        this.downloadList.innerHTML = downloadHtml;
        this.downloadModal.classList.add('show');
        this.showToast('Conversão concluída com sucesso!', 'success');
    }
    
    downloadFile(index) {
        const file = this.convertedFiles[index];
        
        const url = window.URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast(`Download de ${file.name} iniciado!`, 'success');
    }
    
    downloadAllFiles() {
        this.convertedFiles.forEach((_, index) => {
            setTimeout(() => {
                this.downloadFile(index);
            }, index * 500);
        });
        
        this.showToast('Downloads iniciados!', 'success');
    }
    
    closeModal() {
        this.downloadModal.classList.remove('show');
        // Limpar arquivos selecionados após download
        this.clearAllFiles();
        this.showToast('Arquivos originais removidos da lista', 'info');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.simpleConverter = new SimpleImageConverter();
});