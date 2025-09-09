function goToPage2() {
    // Validate form
    const form = document.getElementById('personalForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Save data
    const formData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        profession: document.getElementById('profession').value,
        service: document.getElementById('service').value
    };
    
    FormStorage.savePageData(1, formData);
    window.location.href = 'page2.html';
}

function goToPage3() {
    // This will be implemented in page2
    window.location.href = 'page3.html';
}

function loadSavedData() {
    // Load saved data when pages load
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'page2.html') {
        const page1Data = FormStorage.getPageData(1);
        // You can pre-fill or display data here
        console.log('Loaded Page 1 data:', page1Data);
    }
    
    if (currentPage === 'page3.html') {
        const allData = FormStorage.getAllData();
        console.log('All form data:', allData);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    
    // Add progress bar updates
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'page2.html') {
        document.querySelectorAll('.progress-step')[1].classList.add('active');
    } else if (currentPage === 'page3.html') {
        document.querySelectorAll('.progress-step').forEach(step => step.classList.add('active'));
    }
});

// Add to existing navigation.js

function goBack() {
    window.history.back();
}

function goToPage3() {
    // Validate form
    const form = document.getElementById('requestForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Save request data
    const requestData = {
        organization_type: document.getElementById('organization_type').value,
        related_request: document.getElementById('related_request').value,
        subject: document.getElementById('subject').value,
        content: document.getElementById('content').value
    };
    
    FormStorage.savePageData(2, requestData);
    window.location.href = 'page3.html';
}

// Update the loadSavedData function
function loadSavedData() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'page2.html') {
        const page1Data = FormStorage.getPageData(1);
        displayPersonalSummary(page1Data);
    }
    
    if (currentPage === 'page3.html') {
        const allData = FormStorage.getAllData();
        displayConfirmation(allData);
    }
}

function displayPersonalSummary(data) {
    const summaryContainer = document.getElementById('summary-content');
    if (summaryContainer && data.first_name) {
        summaryContainer.innerHTML = `
            <div class="summary-item"><strong>Name:</strong> ${data.first_name} ${data.last_name || ''}</div>
            <div class="summary-item"><strong>Email:</strong> ${data.email || ''}</div>
            <div class="summary-item"><strong>Phone:</strong> ${data.phone || ''}</div>
            <div class="summary-item"><strong>Profession:</strong> ${data.profession || ''}</div>
            <div class="summary-item"><strong>Service:</strong> ${data.service ? data.service.replace('_', ' ').toUpperCase() : ''}</div>
        `;
    }
}

function displayConfirmation(data) {
    // This will be implemented in page3
    console.log('Confirmation data:', data);
}
// Add to navigation.js

function generateReferenceNumber() {
    return 'REF-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function displayConfirmation(data) {
    if (document.getElementById('user-name')) {
        document.getElementById('user-name').textContent = data.first_name || 'there';
    }
    
    if (document.getElementById('request-details')) {
        document.getElementById('request-details').innerHTML = `
            <p><strong>Subject:</strong> ${data.subject || 'No subject'}</p>
            <p><strong>Service Type:</strong> ${data.service ? data.service.replace('_', ' ') : 'Not specified'}</p>
            <p><strong>Organization:</strong> ${data.organization_type || 'Not specified'}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</p>
        `;
    }
    
    if (document.getElementById('ref-number')) {
        document.getElementById('ref-number').textContent = generateReferenceNumber();
    }
}

function startNewRequest() {
    FormStorage.clearForm();
    window.location.href = 'page1.html';
}

function viewRequestStatus() {
    alert('Request status feature would be implemented here!');
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    
    // Add progress bar updates
    const currentPage = window.location.pathname.split('/').pop();
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (currentPage === 'page2.html') {
        progressSteps[1].classList.add('active');
    } else if (currentPage === 'page3.html') {
        progressSteps.forEach(step => step.classList.add('active'));
        displayConfirmation(FormStorage.getAllData());
    }
});