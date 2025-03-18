// Add form functionality to script.js
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const consentCheckbox = document.getElementById('consent');
    const saveResultsBtn = document.getElementById('save-results-btn');
    
    // Add success message div after the user-data-form
    const userDataForm = document.querySelector('.user-data-form');
    if (userDataForm && !document.querySelector('.success-message')) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.id = 'success-message';
        successMessage.textContent = 'Your information has been saved successfully!';
        userDataForm.insertAdjacentElement('afterend', successMessage);
    }
    
    // Add event listener to save results button
    if (saveResultsBtn) {
        saveResultsBtn.addEventListener('click', function() {
            saveUserData();
        });
    }
    
    // Function to save user data
    function saveUserData() {
        // Get form values
        const userName = userNameInput.value.trim();
        const userEmail = userEmailInput.value.trim();
        const hasConsent = consentCheckbox.checked;
        
        // Validate form
        if (!userName) {
            alert('Please enter your name');
            userNameInput.focus();
            return;
        }
        
        if (!userEmail) {
            alert('Please enter your email');
            userEmailInput.focus();
            return;
        }
        
        if (!validateEmail(userEmail)) {
            alert('Please enter a valid email address');
            userEmailInput.focus();
            return;
        }
        
        // Get calculation results
        const bmr = document.getElementById('bmr-value').textContent;
        const tdee = document.getElementById('tdee-value').textContent;
        const recommendedCalories = document.getElementById('recommended-value').textContent;
        const calorieBalance = document.getElementById('balance-value').textContent;
        const proteinRecommendation = document.getElementById('protein-recommended-value').textContent;
        
        // Create user data object
        const userData = {
            name: userName,
            email: userEmail,
            consent: hasConsent,
            results: {
                bmr: bmr,
                tdee: tdee,
                recommendedCalories: recommendedCalories,
                calorieBalance: calorieBalance,
                proteinRecommendation: proteinRecommendation
            },
            timestamp: new Date().toISOString()
        };
        
        // In a real application, you would send this data to a server
        // For demonstration, we'll log it to console and show success message
        console.log('User data saved:', userData);
        
        // Show success message
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.add('active');
            
            // Hide message after 5 seconds
            setTimeout(function() {
                successMessage.classList.remove('active');
            }, 5000);
        }
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
