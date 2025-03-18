// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Input elements
    const ageInput = document.getElementById('age');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const weightInput = document.getElementById('weight');
    const weightUnitSelect = document.getElementById('weight-unit');
    const heightInput = document.getElementById('height');
    const heightUnitSelect = document.getElementById('height-unit');
    const activitySelect = document.getElementById('activity');
    const goalInputs = document.querySelectorAll('input[name="goal"]');
    const targetWeightInput = document.getElementById('target-weight');
    const targetWeightUnitSelect = document.getElementById('target-weight-unit');
    const targetWeeksInput = document.getElementById('target-weeks');
    const rateValueElement = document.getElementById('rate-value');
    const calculateBtn = document.getElementById('calculate-btn');

    // Results elements
    const bmrValue = document.getElementById('bmr-value');
    const tdeeValue = document.getElementById('tdee-value');
    const recommendedValue = document.getElementById('recommended-value');
    const balanceValue = document.getElementById('balance-value');
    const balanceIndicator = document.getElementById('balance-indicator');
    const weeklyResult = document.getElementById('weekly-result');
    const monthlyResult = document.getElementById('monthly-result');

    // Balance scale elements
    const balanceScale = document.querySelector('.balance-scale');
    const caloriesInValue = document.getElementById('calories-in-value');
    const caloriesOutValue = document.getElementById('calories-out-value');
    const balanceStatusText = document.getElementById('balance-status-text');

    // Protein recommendation elements
    const proteinRecommendedValue = document.getElementById('protein-recommended-value');
    const proteinDailyValue = document.getElementById('protein-daily-value');
    const proteinPerMealValue = document.getElementById('protein-per-meal-value');

    // Modal elements
    const projectionModal = document.getElementById('projection-modal');
    const viewProjectionBtn = document.getElementById('view-projection');
    const modalDailyBalance = document.getElementById('modal-daily-balance');
    const modalWeeklyChange = document.getElementById('modal-weekly-change');
    const modalTimeToGoal = document.getElementById('modal-time-to-goal');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // Accordion elements
    const accordionItems = document.querySelectorAll('.accordion-item');

    // Variables to store calculation results
    let userBMR = 0;
    let userTDEE = 0;
    let recommendedCalories = 0;
    let recommendedProtein = 0;
    let caloriesIn = 0;
    let caloriesOut = 0;
    let calorieBalance = 0;
    let currentGoal = 'deficit';
    let calculatedIntensity = 500;
    let userWeight = 0;
    let userWeightUnit = 'kg';
    let targetWeight = 0;
    let targetWeeks = 0;

    // Initialize the application
    function init() {
        // Set default values
        ageInput.value = 30;
        weightInput.value = 70;
        heightInput.value = 170;
        targetWeightInput.value = 5;
        targetWeeksInput.value = 8;

        // Update recommended rate based on goal
        updateRecommendedRate();
        
        // Add event listeners
        calculateBtn.addEventListener('click', calculateCalories);
        viewProjectionBtn.addEventListener('click', openProjectionModal);
        goalInputs.forEach(input => {
            input.addEventListener('change', updateRecommendedRate);
        });
        targetWeightUnitSelect.addEventListener('change', updateRecommendedRate);

        // Close modals
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeModals);
        });

        // Handle accordion
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                item.classList.toggle('active');
                const icon = header.querySelector('.accordion-icon');
                icon.textContent = item.classList.contains('active') ? '-' : '+';
            });
        });

        // Calculate initial values
        calculateCalories();
    }

    // Update recommended rate based on goal
    function updateRecommendedRate() {
        const goal = document.querySelector('input[name="goal"]:checked').value;
        const unit = targetWeightUnitSelect.value;
        
        if (goal === 'deficit') {
            rateValueElement.textContent = unit === 'kg' ? '0.5-1.0 kg per week' : '1.0-2.0 lbs per week';
        } else if (goal === 'surplus') {
            rateValueElement.textContent = unit === 'kg' ? '0.25-0.5 kg per week' : '0.5-1.0 lbs per week';
        } else {
            rateValueElement.textContent = '0 kg per week (maintenance)';
        }
    }

    // Calculate BMR, TDEE, and recommended calories
    function calculateCalories() {
        // Get user inputs
        const age = parseInt(ageInput.value) || 30;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        let weight = parseFloat(weightInput.value) || 70;
        let height = parseFloat(heightInput.value) || 170;
        const activityLevel = parseFloat(activitySelect.value);
        currentGoal = document.querySelector('input[name="goal"]:checked').value;
        userWeightUnit = weightUnitSelect.value;
        
        // Get target weight and weeks
        targetWeight = parseFloat(targetWeightInput.value) || 5;
        targetWeeks = parseFloat(targetWeeksInput.value) || 8;
        const targetWeightUnit = targetWeightUnitSelect.value;

        // Store original weight for protein calculations
        userWeight = weight;

        // Convert units if necessary
        if (userWeightUnit === 'lbs') {
            weight = weight * 0.453592; // Convert lbs to kg
        }

        if (heightUnitSelect.value === 'in') {
            height = height * 2.54; // Convert inches to cm
        }

        // Convert target weight if necessary
        let targetWeightKg = targetWeight;
        if (targetWeightUnit === 'lbs') {
            targetWeightKg = targetWeight * 0.453592; // Convert lbs to kg
        }

        // Calculate BMR using Mifflin-St Jeor Formula
        if (gender === 'male') {
            userBMR = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            userBMR = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }

        // Calculate TDEE
        userTDEE = userBMR * activityLevel;

        // Calculate required calorie adjustment based on goal and target
        if (currentGoal === 'deficit') {
            // For weight loss: 1kg of fat = 7700 calories
            // Calculate daily deficit needed to lose targetWeight in targetWeeks
            const totalDeficitNeeded = targetWeightKg * 7700;
            const dailyDeficitNeeded = totalDeficitNeeded / (targetWeeks * 7);
            
            // Ensure deficit is within healthy range (250-1000 calories)
            calculatedIntensity = Math.min(Math.max(dailyDeficitNeeded, 250), 1000);
            recommendedCalories = userTDEE - calculatedIntensity;
        } else if (currentGoal === 'surplus') {
            // For weight gain: aim for slower gain (half the rate of loss)
            const totalSurplusNeeded = targetWeightKg * 7700;
            const dailySurplusNeeded = totalSurplusNeeded / (targetWeeks * 7);
            
            // Ensure surplus is within healthy range (250-500 calories)
            calculatedIntensity = Math.min(Math.max(dailySurplusNeeded, 250), 500);
            recommendedCalories = userTDEE + calculatedIntensity;
        } else {
            // Maintenance
            calculatedIntensity = 0;
            recommendedCalories = userTDEE;
        }

        // Calculate recommended protein intake
        calculateProteinRecommendation(weight, activityLevel, currentGoal);

        // Update display
        bmrValue.textContent = Math.round(userBMR);
        tdeeValue.textContent = Math.round(userTDEE);
        recommendedValue.textContent = Math.round(recommendedCalories);

        // Set initial calories in/out values
        caloriesIn = recommendedCalories;
        caloriesOut = userTDEE;

        // Update balance scale
        updateBalanceScale();

        // Calculate projected results
        calculateProjectedResults();
    }

    // Calculate recommended protein intake
    function calculateProteinRecommendation(weight, activityLevel, goal) {
        // Base protein recommendation (g per kg of body weight)
        let proteinMultiplier = 1.6; // Default for moderate activity

        // Adjust based on activity level
        if (activityLevel < 1.4) {
            proteinMultiplier = 1.2; // Sedentary
        } else if (activityLevel >= 1.7) {
            proteinMultiplier = 2.0; // Very active
        }

        // Adjust based on goal
        if (goal === 'deficit') {
            proteinMultiplier += 0.2; // Slightly higher for weight loss to preserve muscle
        } else if (goal === 'surplus') {
            proteinMultiplier += 0.4; // Higher for muscle building
        }

        // Calculate total daily protein
        recommendedProtein = weight * proteinMultiplier;
        
        // Update protein recommendation display
        const proteinPerMeal = recommendedProtein / 4; // Assuming 4 meals per day
        
        proteinRecommendedValue.textContent = `${Math.round(recommendedProtein)} g`;
        proteinDailyValue.textContent = `${Math.round(recommendedProtein)} g`;
        proteinPerMealValue.textContent = `${Math.round(proteinPerMeal)} g`;
    }

    // Update balance scale visualization
    function updateBalanceScale() {
        // Update calorie values
        caloriesInValue.textContent = Math.round(caloriesIn);
        caloriesOutValue.textContent = Math.round(caloriesOut);

        // Calculate calorie balance
        calorieBalance = caloriesOut - caloriesIn;
        balanceValue.textContent = Math.abs(Math.round(calorieBalance));

        // Update balance status
        if (Math.abs(calorieBalance) < 50) {
            balanceIndicator.textContent = 'BALANCED';
            balanceIndicator.style.backgroundColor = 'var(--apple-success)';
            balanceStatusText.textContent = 'Calorie Balance';
            balanceScale.className = 'balance-scale';
        } else if (calorieBalance > 0) {
            balanceIndicator.textContent = 'DEFICIT';
            balanceIndicator.style.backgroundColor = 'var(--apple-primary)';
            balanceStatusText.textContent = 'Calorie Deficit';
            balanceScale.className = 'balance-scale scale-tipped-right';
        } else {
            balanceIndicator.textContent = 'SURPLUS';
            balanceIndicator.style.backgroundColor = 'var(--apple-warning)';
            balanceStatusText.textContent = 'Calorie Surplus';
            balanceScale.className = 'balance-scale scale-tipped-left';
        }

        // Update beam rotation based on calorie balance
        const beamBody = document.querySelector('.beam-body');
        if (beamBody) {
            const maxRotation = 15; // Maximum rotation in degrees
            const rotationFactor = Math.min(Math.abs(calorieBalance) / 1000, 1); // Normalize to 0-1 range
            const rotation = calorieBalance > 0 ? rotationFactor * maxRotation : -rotationFactor * maxRotation;
            beamBody.style.transform = `rotate(${rotation}deg)`;
        }
    }

    // Calculate projected weight change results
    function calculateProjectedResults() {
        // Calculate weekly weight change based on calculated intensity
        const weeklyCalorieBalance = calculatedIntensity * 7;
        let weeklyWeightChange = 0;
        
        if (currentGoal === 'deficit') {
            weeklyWeightChange = weeklyCalorieBalance / 7700; // For kg
            if (userWeightUnit === 'lbs') {
                weeklyWeightChange = weeklyWeightChange * 2.20462; // Convert to lbs
            }
        } else if (currentGoal === 'surplus') {
            weeklyWeightChange = weeklyCalorieBalance / 7700; // For kg
            if (userWeightUnit === 'lbs') {
                weeklyWeightChange = weeklyWeightChange * 2.20462; // Convert to lbs
            }
        }
        
        // Calculate monthly weight change
        const monthlyWeightChange = weeklyWeightChange * 4.33; // Average weeks in a month

        // Update display with calculated values
        const weightUnit = userWeightUnit;
        const weeklyChangeText = currentGoal === 'maintenance' ? 
            '0 ' + weightUnit : 
            (currentGoal === 'deficit' ? 
                '-' + weeklyWeightChange.toFixed(1) + ' ' + weightUnit : 
                '+' + weeklyWeightChange.toFixed(1) + ' ' + weightUnit);
        
        const monthlyChangeText = currentGoal === 'maintenance' ? 
            '0 ' + weightUnit : 
            (currentGoal === 'deficit' ? 
                '-' + monthlyWeightChange.toFixed(1) + ' ' + weightUnit : 
                '+' + monthlyWeightChange.toFixed(1) + ' ' + weightUnit);
                
        // Update weekly and monthly results
        weeklyResult.textContent = weeklyChangeText;
        monthlyResult.textContent = monthlyChangeText;
    }

    // Open projection modal
    function openProjectionModal() {
        projectionModal.classList.add('active');
        
        // Update modal content
        modalDailyBalance.textContent = currentGoal === 'maintenance' ? 
            '0 calories' : 
            (currentGoal === 'deficit' ? 
                '-' + Math.round(calculatedIntensity) + ' calories' : 
                '+' + Math.round(calculatedIntensity) + ' calories');
        
        modalWeeklyChange.textContent = weeklyResult.textContent;
        
        // Calculate time to goal
        if (currentGoal === 'maintenance') {
            modalTimeToGoal.textContent = 'N/A (maintenance)';
        } else {
            modalTimeToGoal.textContent = targetWeeks + ' weeks';
        }
        
        // Render projection chart (simplified)
        renderProjectionChart();
    }

    // Close all modals
    function closeModals() {
        projectionModal.classList.remove('active');
    }

    // Render projection chart (simplified placeholder)
    function renderProjectionChart() {
        const chartContainer = document.getElementById('projection-chart');
        chartContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Weight projection chart will be displayed here</div>';
    }

    // Initialize the application
    init();
});
