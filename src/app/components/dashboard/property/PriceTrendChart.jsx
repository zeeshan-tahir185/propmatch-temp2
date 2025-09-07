"use client";
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PriceTrendChart = ({ predictions }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Helper function to format price in millions or thousands
    const formatPriceInMillions = (value) => {
        if (value >= 1000000) {
            return `$${ (value / 1000000).toFixed(2) }M`; // e.g., $2.23M
        } else if (value >= 1000) {
            return `$${ (value / 1000).toFixed(0) }K`; // e.g., $950K
        }
        return `$${ value.toLocaleString() }`; // e.g., $500
    };

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d');
        if (!ctx) return;

        // Extract unique years from predictions
        const years = [...new Set(predictions.map(pred => new Date(pred.date).getFullYear()))];
        
        // Get current year
        const currentYear = new Date().getFullYear();
        
        // Prepare data for the chart
        const salePrices = predictions.map(pred => pred.estimate_sale_price);
        const listPrices = predictions.map(pred => pred.estimate_list_price);

        if (chartInstance.current) {
            chartInstance.current.destroy(); // Destroy previous chart instance
        }

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years, // Use years for X-axis labels
                datasets: [
                    {
                        label: 'Estimated Sale Price',
                        data: salePrices,
                        borderColor: '#1A2B6C', // Dark blue for sale price
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                            gradient.addColorStop(0, 'rgba(26, 43, 108, 0.2)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2
                    },
                    {
                        label: 'Estimated List Price',
                        data: listPrices,
                        borderColor: '#16A34A', // Green for list price
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                            gradient.addColorStop(0, 'rgba(22, 163, 74, 0.2)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Price ($)',
                            font: { size: 12 }
                        },
                        ticks: {
                            display: true, // Show Y-axis values
                            callback: (value) => formatPriceInMillions(value) // Format as $X.XXM or $XK
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year',
                            font: { size: 12 }
                        },
                        ticks: {
                            display: true // Show X-axis years
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#1A2B6C',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        bodyFont: { size: 14 },
                        padding: 10,
                        cornerRadius: 4,
                        callbacks: {
                            title: () => '', // Disable title in tooltip
                            label: (context) => {
                                const label = context.dataset.label || '';
                                return `${label}: ${formatPriceInMillions(context.raw)}`;
                            }
                        }
                    },
                    legend: {
                        display: true // Show legend to differentiate lines
                    }
                },
                elements: {
                    point: {
                        backgroundColor: (context) => context.dataset.borderColor // Match point color to line
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [predictions]);

    return (
        <div className="w-full h-40 mt-2">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default PriceTrendChart;