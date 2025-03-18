// Protein Distribution Chart
document.addEventListener('DOMContentLoaded', function() {
    // Create protein distribution chart
    function createProteinDistributionChart() {
        // Get protein recommendation
        const proteinDailyValue = document.getElementById('protein-daily-value');
        const dailyProtein = parseInt(proteinDailyValue.textContent) || 98;
        
        // Calculate distribution
        const breakfastProtein = Math.round(dailyProtein * 0.25); // 25%
        const lunchProtein = Math.round(dailyProtein * 0.30); // 30%
        const dinnerProtein = Math.round(dailyProtein * 0.30); // 30%
        const snacksProtein = Math.round(dailyProtein * 0.15); // 15%
        
        // Create distribution HTML
        const proteinInfo = document.querySelector('.protein-info');
        
        // Create distribution section if it doesn't exist
        if (!document.querySelector('.protein-distribution')) {
            const distributionHTML = `
                <div class="protein-distribution">
                    <div class="distribution-legend">
                        <div class="legend-item">
                            <div class="legend-color breakfast-bar"></div>
                            <span>Breakfast (25%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color lunch-bar"></div>
                            <span>Lunch (30%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color dinner-bar"></div>
                            <span>Dinner (30%)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color snacks-bar"></div>
                            <span>Snacks (15%)</span>
                        </div>
                    </div>
                    <div class="distribution-item">
                        <div class="distribution-label">Breakfast</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar breakfast-bar" style="width: 25%"></div>
                        </div>
                        <div class="distribution-value">${breakfastProtein}g</div>
                    </div>
                    <div class="distribution-item">
                        <div class="distribution-label">Lunch</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar lunch-bar" style="width: 30%"></div>
                        </div>
                        <div class="distribution-value">${lunchProtein}g</div>
                    </div>
                    <div class="distribution-item">
                        <div class="distribution-label">Dinner</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar dinner-bar" style="width: 30%"></div>
                        </div>
                        <div class="distribution-value">${dinnerProtein}g</div>
                    </div>
                    <div class="distribution-item">
                        <div class="distribution-label">Snacks</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar snacks-bar" style="width: 15%"></div>
                        </div>
                        <div class="distribution-value">${snacksProtein}g</div>
                    </div>
                    <p class="protein-info-text">Distributing your protein intake throughout the day helps maximize muscle protein synthesis and recovery.</p>
                </div>
            `;
            
            proteinInfo.insertAdjacentHTML('beforeend', distributionHTML);
        } else {
            // Update existing chart
            document.querySelector('.distribution-item:nth-child(2) .distribution-value').textContent = `${breakfastProtein}g`;
            document.querySelector('.distribution-item:nth-child(3) .distribution-value').textContent = `${lunchProtein}g`;
            document.querySelector('.distribution-item:nth-child(4) .distribution-value').textContent = `${dinnerProtein}g`;
            document.querySelector('.distribution-item:nth-child(5) .distribution-value').textContent = `${snacksProtein}g`;
        }
    }
    
    // Update chart when calculate button is clicked
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', createProteinDistributionChart);
    }
    
    // Create initial chart
    createProteinDistributionChart();
});
