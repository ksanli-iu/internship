class FormStorage {
    static savePageData(pageNumber, data) {
        localStorage.setItem(`form_page${pageNumber}`, JSON.stringify(data));
    }

    static getPageData(pageNumber) {
        return JSON.parse(localStorage.getItem(`form_page${pageNumber}`) || '{}');
    }

    static getAllData() {
        return {
            ...this.getPageData(1),
            ...this.getPageData(2),
            submission_date: new Date().toISOString()
        };
    }

    static clearForm() {
        localStorage.removeItem('form_page1');
        localStorage.removeItem('form_page2');
    }

    static exportData() {
        return this.getAllData();
    }
}