        const canvas = document.getElementById('quantumCanvas');
        const ctx = canvas.getContext('2d');
        const barrierPotential = 10; 
        const scalingConstant = 0.5; 
        const particleRadius = 10;
        const barrierWidthMultiplier = 20; 
        const particleSpeed = 4; 
        const barrierX = canvas.width / 2;
        const groundY = canvas.height - 20;

        const energySlider = document.getElementById('energy-slider');
        const widthSlider = document.getElementById('width-slider');
        const energyValueDisplay = document.getElementById('energy-value');
        const widthValueDisplay = document.getElementById('width-value');
        const probabilityDisplay = document.getElementById('probability-display');
        const tunnelButton = document.getElementById('tunnel-button');
        const aiFeedback = document.getElementById('ai-feedback');
        const predictionOverlay = document.getElementById('prediction-overlay');
        const predictionText = document.getElementById('prediction-text');
        
        let particle = { x: 50, y: groundY, vx: 0, tunneling: false, status: 'ready' };
        let currentProbability = 0;
        let animationFrameId = null;

        // --- Physics Calculation ---
        
        // Calculates the tunneling probability T based on input energy E and barrier width L.
        
        function calculateProbability(E, L) {
            if (E >= barrierPotential) {
                // Classical mechanics: E >= V0, probability is 1 (certainty)
                return 1.0;
            }
            
            // Quantum mechanics: E < V0, tunneling is possible
            const energyDifference = barrierPotential - E; // V0 - E
            
            // Simplified exponent: -C * L * sqrt(V0 - E)
            const exponent = -scalingConstant * L * Math.sqrt(energyDifference);
            
            const T = Math.exp(exponent);
            return Math.max(0, Math.min(1, T)); // Ensure T is between 0 and 1
        }

        // --- AI Tutor Logic ---

        function provideFeedback(E, L, didTunnel) {
            const V0 = barrierPotential;
            let message = '';

            // Case 1: Classical Success (E >= V0)
            if (E >= V0) {
                message = `That was a classical success! Since your energy ($E=${E}$) was greater than the barrier height ($V_0=${V0}$), you passed through with 100% certainty. Try setting $E$ lower than $V_0$ to observe true quantum tunneling!`;
                aiFeedback.className = 'text-green-400 italic';
            }
            // Case 2: Quantum Attempt
            else {
                const probability = calculateProbability(E, L);

                if (didTunnel) {
                    // Success, but provide context
                    if (probability > 0.8) {
                        message = `Success! Your probability was high (${(probability * 100).toFixed(1)}%). Good job keeping the barrier width ($L=${L}$) low and energy ($E=${E}$) high!`;
                        aiFeedback.className = 'text-green-400 italic';
                    } else if (probability < 0.2) {
                        message = `A lucky shot! You succeeded despite a low probability (${(probability * 100).toFixed(1)}%). Remember, quantum mechanics only gives us odds, not certainties.`;
                        aiFeedback.className = 'text-yellow-400 italic';
                    } else {
                         message = `Tunneling successful! Your parameters ($E=${E}$, $L=${L}$) gave you a ${Math.round(probability * 100)}% chance. That's the power of quantum mechanics!`;
                         aiFeedback.className = 'text-green-400 italic';
                    }
                } else {
                    // Failure, provide specific advice
                    if (L > 7 && probability < 0.1) {
                        message = `Reflection! The barrier is too thick ($L=${L}$). Tunneling probability decreases exponentially with width. Try reducing the **Barrier Width ($L$)**.`;
                        aiFeedback.className = 'text-red-400 italic';
                    } else if (E < 4 && probability < 0.1) {
                         message = `Reflection! Your particle energy ($E=${E}$) is very low compared to the barrier height ($V_0=${V0}$). Try increasing the **Particle Energy ($E$)** significantly.`;
                         aiFeedback.className = 'text-red-400 italic';
                    } else {
                         message = `Reflection occurred. To increase your odds, try simultaneously increasing **Energy ($E$)** and decreasing **Width ($L$)**.`;
                         aiFeedback.className = 'text-red-400 italic';
                    }
                }
            }
            aiFeedback.textContent = message;
        }

        // --- Canvas Drawing and Animation ---

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the ground (bottom boundary)
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(0, groundY + particleRadius, canvas.width, canvas.height - groundY - particleRadius);

            // Draw the Energy Barrier
            const currentBarrierWidth = parseFloat(widthSlider.value) * barrierWidthMultiplier;
            const barrierLeft = barrierX - currentBarrierWidth / 2;
            const barrierRight = barrierX + currentBarrierWidth / 2;
            const barrierHeight = groundY;

            ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'; 
            ctx.fillRect(barrierLeft, 0, currentBarrierWidth, barrierHeight);

            // Barrier text
            ctx.fillStyle = '#fff';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`Potential Barrier (V₀=${barrierPotential})`, barrierX, 30);
            ctx.fillText(`Width L=${widthSlider.value}`, barrierX, barrierHeight - 10);
            
            // Draw the Particle
            ctx.fillStyle = particle.status === 'success' ? '#10b981' : (particle.status === 'failed' ? '#ef4444' : '#fcd34d');
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particleRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }

        function animate() {
            // 1. Update position
            if (particle.vx !== 0) {
                particle.x += particle.vx;
            }

            const currentBarrierWidth = parseFloat(widthSlider.value) * barrierWidthMultiplier;
            const barrierLeft = barrierX - currentBarrierWidth / 2;
            const barrierRight = barrierX + currentBarrierWidth / 2;
            
            // 2. Check for collision/tunneling
            if (particle.tunneling) {
                // Particle is moving through the barrier area (visualization of tunneling)
                if (particle.vx > 0 && particle.x >= barrierRight) {
                    // Success: reached the other side
                    particle.vx = 0;
                    particle.tunneling = false;
                    particle.status = 'success';
                    tunnelButton.disabled = false;
                    provideFeedback(parseFloat(energySlider.value), parseFloat(widthSlider.value), true);
                } else if (particle.vx < 0 && particle.x <= 50) {
                    // Failure: reflected back to start
                    particle.vx = 0;
                    particle.tunneling = false;
                    particle.x = 50; // Snap back to starting position
                    particle.status = 'failed';
                    tunnelButton.disabled = false;
                    provideFeedback(parseFloat(energySlider.value), parseFloat(widthSlider.value), false);
                }
            } else if (particle.vx > 0 && particle.x + particleRadius >= barrierLeft) {
                // Initial collision with the barrier
                particle.vx = 0; // Stop momentarily
                runTunnelSimulation();
            }

            // 3. Redraw
            draw();

            // 4. Loop: Continue looping as long as the particle is 'traveling'
            if (particle.status === 'traveling') {
                animationFrameId = requestAnimationFrame(animate);
            }
        }
        
        // --- Game Logic ---

        function updateUI() {
            const E = parseFloat(energySlider.value);
            const L = parseFloat(widthSlider.value);
            
            energyValueDisplay.textContent = E;
            widthValueDisplay.textContent = L;

            currentProbability = calculateProbability(E, L);
            probabilityDisplay.textContent = `${(currentProbability * 100).toFixed(2)}%`;

            draw();
            
            // AI Prediction Visualization
            if (E < barrierPotential) {
                predictionOverlay.style.opacity = '1';
                predictionText.textContent = `Predicted Tunnel Probability: ${Math.round(currentProbability * 100)}%`;
                
                // Adjust ghost particle color based on probability
                if (currentProbability < 0.3) {
                    predictionText.style.color = '#ef4444'; // Red
                } else if (currentProbability < 0.7) {
                    predictionText.style.color = '#fcd34d'; // Yellow
                } else {
                    predictionText.style.color = '#10b981'; // Green
                }
            } else {
                predictionOverlay.style.opacity = '0';
            }
        }
        
        function runTunnelSimulation() {
            const E = parseFloat(energySlider.value);
            const L = parseFloat(widthSlider.value);
            const T = calculateProbability(E, L);
            
            const randomRoll = Math.random();

            // Set up movement based on outcome
            particle.tunneling = true;
            
            if (randomRoll <= T) {
                // Tunneling success: particle continues moving right (visualizing it appearing on the other side)
                particle.vx = particleSpeed;
                particle.status = 'traveling';
            } else {
                // Reflection: particle moves left
                particle.vx = -particleSpeed / 2; // Slower reflection bounce
                particle.status = 'traveling';
            }
        }

        // --- Event Listeners and Initial Setup ---

        energySlider.addEventListener('input', updateUI);
        widthSlider.addEventListener('input', updateUI);
        
        tunnelButton.addEventListener('click', () => {
            // Reset particle state
            cancelAnimationFrame(animationFrameId);
            particle = { x: 50, y: groundY, vx: particleSpeed, tunneling: false, status: 'traveling' };
            tunnelButton.disabled = true;
            
            aiFeedback.textContent = 'Analyzing parameters and initiating attempt...';
            aiFeedback.className = 'text-gray-200 italic';
            
            animationFrameId = requestAnimationFrame(animate);
        });

        updateUI();