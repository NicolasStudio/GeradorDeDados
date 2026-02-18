class FileConverter {
    constructor() {
        this.selectedFiles = [];
        this.currentConversion = null;
        this.currentTab = 'pdf-to-images';
        this.convertedFiles = [];
        
        // Configurar PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        
        // APENAS FORMATOS DE IMAGEM
        this.supportedConversions = {
            // PDF para Imagens
            'pdf-to-png': { 
                from: '.pdf', 
                to: '.png', 
                name: 'PDF para PNG',
                mimeType: 'image/png',
                extension: 'png',
                quality: 1.0
            },
            'pdf-to-jpg': { 
                from: '.pdf', 
                to: '.jpg', 
                name: 'PDF para JPG',
                mimeType: 'image/jpeg',
                extension: 'jpg',
                quality: 0.92
            },
            'pdf-to-jpeg': { 
                from: '.pdf', 
                to: '.jpeg', 
                name: 'PDF para JPEG',
                mimeType: 'image/jpeg',
                extension: 'jpeg',
                quality: 0.92
            },
            'pdf-to-webp': { 
                from: '.pdf', 
                to: '.webp', 
                name: 'PDF para WEBP',
                mimeType: 'image/webp',
                extension: 'webp',
                quality: 0.9
            },
            'pdf-to-bmp': { 
                from: '.pdf', 
                to: '.bmp', 
                name: 'PDF para BMP',
                mimeType: 'image/bmp',
                extension: 'bmp',
                quality: 1.0
            },
            'pdf-to-gif': { 
                from: '.pdf', 
                to: '.gif', 
                name: 'PDF para GIF',
                mimeType: 'image/gif',
                extension: 'gif',
                quality: 0.8
            },
            'pdf-to-tiff': { 
                from: '.pdf', 
                to: '.tiff', 
                name: 'PDF para TIFF',
                mimeType: 'image/tiff',
                extension: 'tiff',
                quality: 1.0
            },
            'pdf-to-avif': { 
                from: '.pdf', 
                to: '.avif', 
                name: 'PDF para AVIF',
                mimeType: 'image/avif',
                extension: 'avif',
                quality: 0.9
            },
            'pdf-to-heic': { 
                from: '.pdf', 
                to: '.heic', 
                name: 'PDF para HEIC',
                mimeType: 'image/heic',
                extension: 'heic',
                quality: 0.95
            },
            
            // Imagens para PDF
            'png-to-pdf': { 
                from: '.png', 
                to: '.pdf', 
                name: 'PNG para PDF',
                accept: 'image/png'
            },
            'jpg-to-pdf': { 
                from: '.jpg,.jpeg', 
                to: '.pdf', 
                name: 'JPG para PDF',
                accept: 'image/jpeg'
            },
            'jpeg-to-pdf': { 
                from: '.jpeg,.jpg', 
                to: '.pdf', 
                name: 'JPEG para PDF',
                accept: 'image/jpeg'
            },
            'webp-to-pdf': { 
                from: '.webp', 
                to: '.pdf', 
                name: 'WEBP para PDF',
                accept: 'image/webp'
            },
            'bmp-to-pdf': { 
                from: '.bmp', 
                to: '.pdf', 
                name: 'BMP para PDF',
                accept: 'image/bmp'
            },
            'gif-to-pdf': { 
                from: '.gif', 
                to: '.pdf', 
                name: 'GIF para PDF',
                accept: 'image/gif'
            },
            'tiff-to-pdf': { 
                from: '.tiff,.tif', 
                to: '.pdf', 
                name: 'TIFF para PDF',
                accept: 'image/tiff'
            },
            'avif-to-pdf': { 
                from: '.avif', 
                to: '.pdf', 
                name: 'AVIF para PDF',
                accept: 'image/avif'
            },
            'heic-to-pdf': { 
                from: '.heic,.heif', 
                to: '.pdf', 
                name: 'HEIC para PDF',
                accept: 'image/heic'
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindElements();
        this.bindEvents();
        this.updateFileList();
    }
    
    bindElements() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.filesList = document.getElementById('filesList');
        this.selectedFilesDiv = document.getElementById('selectedFiles');
        this.progressArea = document.getElementById('progressArea');
        this.convertBtn = document.getElementById('convertBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.tabs = document.querySelectorAll('.tab-btn');
        this.conversionCards = document.querySelectorAll('.conversion-card');
        this.grids = document.querySelectorAll('.conversion-grid');
        this.toastContainer = document.getElementById('toastContainer');
        this.downloadModal = document.getElementById('downloadModal');
        this.modalMessage = document.getElementById('modalMessage');
        this.downloadList = document.getElementById('downloadList');
        this.downloadAllBtn = document.getElementById('downloadAllBtn');
    }
    
    bindEvents() {
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        this.conversionCards.forEach(card => {
            card.addEventListener('click', () => this.toggleConversion(card.dataset.conversion));
        });
        
        this.convertBtn.addEventListener('click', () => this.startConversion());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.downloadAllBtn.addEventListener('click', () => this.downloadAllFiles());
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.addFiles(files);
    }
    
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFiles(files);
    }
    
    // Toggle: clicar no mesmo formato desmarca
    toggleConversion(conversionId) {
        if (this.currentConversion === conversionId) {
            // Desmarcar
            this.currentConversion = null;
            this.conversionCards.forEach(card => {
                card.classList.remove('selected');
            });
            
            const hint = this.uploadArea.querySelector('.upload-hint');
            hint.textContent = 'ou clique para selecionar';
            this.fileInput.accept = '';
            
            this.showToast('Conversão desmarcada', 'info');
        } else {
            // Selecionar nova conversão
            this.selectConversion(conversionId);
        }
    }
    
    selectConversion(conversionId) {
        this.currentConversion = conversionId;
        
        this.conversionCards.forEach(card => {
            card.classList.toggle('selected', card.dataset.conversion === conversionId);
        });
        
        const conversion = this.supportedConversions[conversionId];
        if (conversion) {
            const hint = this.uploadArea.querySelector('.upload-hint');
            hint.textContent = `Formatos suportados: ${conversion.from}`;
            
            if (conversion.accept) {
                this.fileInput.accept = conversion.accept;
            } else {
                this.fileInput.accept = conversion.from;
            }
        }
    }
    
    addFiles(files) {
        if (!this.currentConversion) {
            this.showToast('Selecione um tipo de conversão primeiro!', 'warning');
            return;
        }
        
        const validFiles = this.validateFiles(files);
        
        if (validFiles.length === 0) {
            const conversion = this.supportedConversions[this.currentConversion];
            this.showToast(`Formato inválido! Use: ${conversion.from}`, 'error');
            return;
        }
        
        this.selectedFiles = [...this.selectedFiles, ...validFiles];
        this.updateFileList();
        this.fileInput.value = '';
        
        setTimeout(() => {
            this.filesList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        this.showToast(`${validFiles.length} arquivo(s) adicionado(s)!`, 'success');
    }
    
    validateFiles(files) {
        const conversion = this.supportedConversions[this.currentConversion];
        if (!conversion) return files;
        
        const allowedExtensions = conversion.from.split(',');
        return files.filter(file => {
            const ext = this.getFileExtension(file.name).toLowerCase();
            return allowedExtensions.some(allowed => 
                ext === allowed.replace('.', '') || '.' + ext === allowed
            );
        });
    }
    
    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
    
    updateFileList() {
        if (this.selectedFiles.length === 0) {
            this.filesList.style.display = 'none';
            return;
        }
        
        this.filesList.style.display = 'block';
        let html = '';
        
        this.selectedFiles.forEach((file, index) => {
            html += `
                <div class="file-item">
                    <span class="file-icon">📄</span>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)}</span>
                    <button class="file-remove" onclick="converter.removeFile(${index})">×</button>
                </div>
            `;
        });
        
        this.selectedFilesDiv.innerHTML = html;
    }
    
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
        this.showToast('Arquivo removido', 'info');
    }
    
    switchTab(tabId) {
        this.currentTab = tabId;
        
        this.tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        this.grids.forEach(grid => {
            grid.classList.toggle('active', grid.id === tabId);
        });
        
        // Resetar seleção ao mudar de aba
        this.currentConversion = null;
        this.conversionCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        const hint = this.uploadArea.querySelector('.upload-hint');
        hint.textContent = 'ou clique para selecionar';
        this.fileInput.accept = '';
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
    
    async startConversion() {
        if (this.selectedFiles.length === 0) {
            this.showToast('Selecione pelo menos um arquivo!', 'warning');
            return;
        }
        
        if (!this.currentConversion) {
            this.showToast('Selecione um tipo de conversão!', 'warning');
            return;
        }
        
        const conversion = this.supportedConversions[this.currentConversion];
        if (!conversion) {
            this.showToast('Tipo de conversão não suportado!', 'error');
            return;
        }
        
        this.progressArea.style.display = 'block';
        this.convertBtn.disabled = true;
        this.convertedFiles = [];
        
        try {
            if (this.currentConversion.startsWith('pdf-to')) {
                await this.convertPdfToImages(this.selectedFiles, conversion);
            } else {
                await this.convertImagesToPdf(this.selectedFiles, conversion);
            }
        } catch (error) {
            console.error('Erro na conversão:', error);
            this.showToast('Erro ao converter arquivos!', 'error');
            this.progressArea.style.display = 'none';
            this.convertBtn.disabled = false;
        }
    }
    
    async convertPdfToImages(files, conversion) {
        this.showToast(`Iniciando ${conversion.name}...`, 'info');
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.updateProgress((i / files.length) * 100, file.name);
            
            try {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    
                    let scale = 2.0;
                    if (conversion.extension === 'jpg' || conversion.extension === 'jpeg' || conversion.extension === 'webp') {
                        scale = 1.5;
                    } else if (conversion.extension === 'tiff') {
                        scale = 3.0;
                    }
                    
                    const viewport = page.getViewport({ scale: scale });
                    
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                    
                    let blob;
                    if (conversion.extension === 'jpg' || conversion.extension === 'jpeg') {
                        blob = await new Promise(resolve => 
                            canvas.toBlob(resolve, 'image/jpeg', conversion.quality)
                        );
                    } else if (conversion.extension === 'png') {
                        blob = await new Promise(resolve => 
                            canvas.toBlob(resolve, 'image/png')
                        );
                    } else if (conversion.extension === 'webp') {
                        blob = await new Promise(resolve => 
                            canvas.toBlob(resolve, 'image/webp', conversion.quality)
                        );
                    } else {
                        blob = await new Promise(resolve => 
                            canvas.toBlob(resolve, 'image/png')
                        );
                    }
                    
                    const fileName = file.name.replace('.pdf', `_pagina_${pageNum}.${conversion.extension}`);
                    
                    this.convertedFiles.push({
                        name: fileName,
                        size: blob.size,
                        blob: blob,
                        type: conversion.extension.toUpperCase()
                    });
                }
                
                this.showToast(`PDF convertido para ${conversion.extension.toUpperCase()}!`, 'success');
                
            } catch (error) {
                console.error('Erro ao converter PDF:', error);
                this.showToast(`Erro no arquivo: ${file.name}`, 'error');
            }
        }
        
        this.finishConversion();
    }
    
    async convertImagesToPdf(files, conversion) {
        this.showToast(`Iniciando ${conversion.name}...`, 'info');
        
        const { jsPDF } = window.jspdf;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            this.updateProgress((i / files.length) * 100, file.name);
            
            try {
                const pdf = new jsPDF();
                
                const imageUrl = URL.createObjectURL(file);
                const img = new Image();
                
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        const imgWidth = img.width;
                        const imgHeight = img.height;
                        
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = pdf.internal.pageSize.getHeight();
                        
                        let width = pdfWidth;
                        let height = (imgHeight * pdfWidth) / imgWidth;
                        
                        if (height > pdfHeight) {
                            height = pdfHeight;
                            width = (imgWidth * pdfHeight) / imgHeight;
                        }
                        
                        const x = (pdfWidth - width) / 2;
                        const y = (pdfHeight - height) / 2;
                        
                        let format = 'JPEG';
                        if (file.type.includes('png')) format = 'PNG';
                        else if (file.type.includes('webp')) format = 'WEBP';
                        
                        pdf.addImage(img, format, x, y, width, height);
                        
                        const fileName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
                        const pdfBlob = pdf.output('blob');
                        
                        this.convertedFiles.push({
                            name: fileName,
                            size: pdfBlob.size,
                            blob: pdfBlob,
                            type: 'PDF'
                        });
                        
                        URL.revokeObjectURL(imageUrl);
                        resolve();
                    };
                    
                    img.onerror = reject;
                    img.src = imageUrl;
                });
                
                this.showToast(`Imagem ${i+1} convertida para PDF!`, 'success');
                
            } catch (error) {
                console.error('Erro ao converter imagem:', error);
                this.showToast(`Erro no arquivo: ${file.name}`, 'error');
            }
        }
        
        this.finishConversion();
    }
    
    finishConversion() {
        this.updateProgress(100, 'Concluído!');
        setTimeout(() => {
            this.progressArea.style.display = 'none';
            this.convertBtn.disabled = false;
            this.showDownloadModal();
        }, 500);
    }
    
    updateProgress(percentage, filename) {
        const progressFill = document.querySelector('.progress-fill');
        const percentageEl = document.querySelector('.progress-percentage');
        const filenameEl = document.querySelector('.progress-filename');
        
        progressFill.style.width = `${percentage}%`;
        percentageEl.textContent = `${Math.round(percentage)}%`;
        filenameEl.textContent = `Convertendo: ${filename}`;
    }
    
    showDownloadModal() {
        this.modalMessage.textContent = `${this.convertedFiles.length} arquivo(s) convertido(s) com sucesso!`;
        
        let downloadHtml = '';
        this.convertedFiles.forEach((file, index) => {
            downloadHtml += `
                <div class="download-item">
                    <span class="download-icon">📥</span>
                    <div class="download-info">
                        <span class="download-name">${file.name}</span>
                        <span class="download-size">${this.formatFileSize(file.size)}</span>
                    </div>
                    <button class="download-btn" onclick="converter.downloadFile(${index})">Download</button>
                </div>
            `;
        });
        
        this.downloadList.innerHTML = downloadHtml;
        this.downloadModal.classList.add('show');
        this.showToast('Conversão concluída!', 'success');
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
    }
    
    closeModal() {
        this.downloadModal.classList.remove('show');
        
        // Limpar arquivos selecionados após download
        this.clearSelectedFiles();
        this.showToast('Arquivos originais removidos da lista', 'info');
    }
    
    clearSelectedFiles() {
        this.selectedFiles = [];
        this.updateFileList();
        this.filesList.style.display = 'none';
    }
    
    clearAll() {
        this.selectedFiles = [];
        this.currentConversion = null;
        this.convertedFiles = [];
        this.updateFileList();
        this.filesList.style.display = 'none';
        this.progressArea.style.display = 'none';
        
        this.conversionCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        const hint = this.uploadArea.querySelector('.upload-hint');
        hint.textContent = 'ou clique para selecionar';
        this.fileInput.accept = '';
        
        this.showToast('Todos os arquivos foram removidos', 'info');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.converter = new FileConverter();
});