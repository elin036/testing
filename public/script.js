document.addEventListener('DOMContentLoaded', () => {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            // Convert Year and Index to numbers
            data.forEach(row => {
                row.Year = Number(row.Year);
                row.Index = Number(row.Index);
                row.Rank = Number(row.Rank);
            });

            // Filter data for the year 2023
            const data2023 = data.filter(row => row.Year === 2023);
            console.log('Data for 2023:', data2023);

            if (data2023.length === 0) {
                console.error('No data found for the year 2023.');
                return;
            }

            // Sort by Rank and get top 10 countries
            const top10Countries2023 = data2023.sort((a, b) => a.Rank - b.Rank).slice(0, 10).map(row => row.Country);
            console.log('Top 10 Countries in 2023:', top10Countries2023);

            const years = [...new Set(data.map(row => row.Year))].sort((a, b) => a - b);
            console.log('Years:', years);

            const datasets = top10Countries2023.map(country => {
                const countryData = data.filter(row => row.Country === country);
                console.log(`Data for ${country}:`, countryData);

                return {
                    label: country,
                    data: years.map(year => {
                        const entry = countryData.find(row => row.Year === year);
                        return entry ? entry.Index : null;
                    }),
                    fill: false,
                    borderColor: getRandomColor(),
                    borderWidth: 2
                };
            });

            console.log('Datasets:', datasets);

            const ctx = document.getElementById('happinessChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            },
                            ticks: {
                                autoSkip: false,
                                maxRotation: 90,
                                minRotation: 45
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Happiness Index'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


