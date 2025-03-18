// Animations for the Calorie Balance App
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.panel-section, .protein-recommendation, .balance-scale-container');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // Add fade-in class to elements
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Add animation to balance scale when values change
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const balanceScale = document.querySelector('.balance-scale');
            
            if (balanceScale) {
                balanceScale.classList.add('scale-animation');
                
                setTimeout(() => {
                    balanceScale.classList.remove('scale-animation');
                }, 1000);
            }
        });
    }
});
