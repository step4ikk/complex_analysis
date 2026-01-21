// Программы для работы с комплексными числами

// 1. Конвертер форм записи
document.addEventListener('DOMContentLoaded', function() {
    // Конвертер
    const converterButton = document.getElementById('converter_button');
    if (converterButton) {
        converterButton.onclick = function() {
            const converterValue = document.getElementById('converter_value');
            const converterType = document.getElementById('converter_type');
            const converterOut = document.getElementById('converter_out');
            
            if (!converterValue.value) {
                alert('Поле не заполнено');
                return;
            }
            
            try {
                // Парсим комплексное число
                let complex;
                try {
                    complex = math.complex(converterValue.value);
                } catch (e) {
                    // Пробуем другой формат
                    const match = converterValue.value.match(/(-?\d+(?:\.\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?)i/);
                    if (match) {
                        const sign = match[2] === '+' ? 1 : -1;
                        const real = parseFloat(match[1]);
                        const imag = parseFloat(match[3]) * sign;
                        complex = math.complex(real, imag);
                    } else {
                        throw new Error('Неверный формат комплексного числа');
                    }
                }
                
                const a = complex.re;
                const b = complex.im;
                const r = Math.sqrt(a * a + b * b);
                const phi = Math.atan2(b, a);
                
                let result;
                if (converterType.value === '0') {
                    // Тригонометрическая форма
                    result = katex.renderToString(
                        r.toFixed(2) + 
                        '\\left(\\cos' + phi.toFixed(2) + 
                        ' + i\\sin' + phi.toFixed(2) + '\\right)'
                    );
                } else {
                    // Показательная форма
                    result = katex.renderToString(
                        r.toFixed(2) + 'e^{' + phi.toFixed(2) + 'i}'
                    );
                }
                
                converterOut.innerHTML = result;
            } catch (error) {
                converterOut.innerHTML = '<span style="color: red;">Ошибка: ' + error.message + '</span>';
            }
        };
    }
    
    // 2. Построитель векторов
    const plotButton = document.getElementById('plot_button');
    if (plotButton) {
        plotButton.onclick = function() {
            const real = parseFloat(document.getElementById('vector_real').value) || 0;
            const imag = parseFloat(document.getElementById('vector_imag').value) || 0;
            
            const trace = {
                type: 'scatter',
                mode: 'lines+markers',
                x: [0, real],
                y: [0, imag],
                line: {
                    color: '#1a73e8',
                    width: 3
                },
                marker: {
                    size: 10,
                    color: '#ea4335'
                },
                name: `z = ${real} + ${imag}i`
            };
            
            const layout = {
                xaxis: {
                    title: 'Действительная ось (Re)',
                    range: [-Math.max(5, Math.abs(real) * 1.5), Math.max(5, Math.abs(real) * 1.5)],
                    zeroline: true,
                    gridcolor: '#eee'
                },
                yaxis: {
                    title: 'Мнимая ось (Im)',
                    range: [-Math.max(5, Math.abs(imag) * 1.5), Math.max(5, Math.abs(imag) * 1.5)],
                    zeroline: true,
                    gridcolor: '#eee'
                },
                showlegend: true,
                legend: {
                    x: 0,
                    y: 1
                },
                plot_bgcolor: '#f8f9fa',
                paper_bgcolor: '#f8f9fa'
            };
            
            Plotly.newPlot('plotly_graph', [trace], layout);
        };
        
        // Автоматически строим первый график
        plotButton.click();
    }
    
    // 3. Калькулятор комплексных чисел
    const operationButtons = document.querySelectorAll('.op-btn');
    if (operationButtons.length > 0) {
        operationButtons.forEach(button => {
            button.onclick = function() {
                const op = this.getAttribute('data-op');
                const num1Input = document.getElementById('calc_num1');
                const num2Input = document.getElementById('calc_num2');
                const resultDiv = document.getElementById('calc_result');
                
                try {
                    const z1 = math.complex(num1Input.value);
                    const z2 = math.complex(num2Input.value);
                    
                    let result;
                    let operationSymbol;
                    
                    switch (op) {
                        case 'add':
                            result = math.add(z1, z2);
                            operationSymbol = '+';
                            break;
                        case 'sub':
                            result = math.subtract(z1, z2);
                            operationSymbol = '-';
                            break;
                        case 'mul':
                            result = math.multiply(z1, z2);
                            operationSymbol = '×';
                            break;
                        case 'div':
                            if (z2.re === 0 && z2.im === 0) {
                                throw new Error('Деление на ноль');
                            }
                            result = math.divide(z1, z2);
                            operationSymbol = '÷';
                            break;
                        default:
                            throw new Error('Неизвестная операция');
                    }
                    
                    // Форматируем результат
                    const formattedResult = `${result.re.toFixed(2)} ${result.im >= 0 ? '+' : ''} ${result.im.toFixed(2)}i`;
                    
                    // Отображаем с использованием KaTeX
                    const latex = katex.renderToString(
                        `(${z1.re} ${z1.im >= 0 ? '+' : ''} ${z1.im}i) ${operationSymbol} ` +
                        `(${z2.re} ${z2.im >= 0 ? '+' : ''} ${z2.im}i) = ` +
                        `${result.re.toFixed(2)} ${result.im >= 0 ? '+' : ''} ${result.im.toFixed(2)}i`
                    );
                    
                    resultDiv.innerHTML = latex;
                    
                } catch (error) {
                    resultDiv.innerHTML = `<span style="color: red;">Ошибка: ${error.message}</span>`;
                }
            };
        });
        
        // Автоматически выполняем сложение при загрузке
        if (operationButtons[0]) {
            operationButtons[0].click();
        }
    }
});
