# ⚛️ The Quantum Leaper: An AI-Enhanced Quantum Tunneling Model  

## Project Overview  
The Quantum Leaper is an interactive, single-file web application designed to educate users about Quantum Tunneling, a fundamental yet counter-intuitive concept in quantum mechanics.  

Unlike classical mechanics, which forbids a particle from passing through an energy barrier higher than its own kinetic energy, quantum mechanics predicts a non-zero probability of passage—the phenomenon of tunneling. This simulation allows users to manipulate key physical parameters and observe the probabilistic nature of the quantum world in real time.   

## 🔬 The Physics Model: Quantum Tunneling  
The core of the simulation relies on the relationship between a particle's probability of tunneling (T) and two main factors:  

1. Particle Energy (E): The energy of the incoming particle (must be less than the Barrier Potential, V0 =10, for true tunneling to occur).  

2. Barrier Width (L): The thickness of the energy barrier.  

The probability of tunneling decreases exponentially as the barrier width (L) increases or as the energy difference (V0−E) increases.  

**T** ∝ e ^ [ - (constant) \* L \* sqrt(V₀ - E) ]
​
## 🎮 Game Demo  

👉 Try it live here:  [The Quantum Leaper](https://delicate-pasca-5db093.netlify.app/)  



## ✨ Key Features & AI Enhancement
The application uses an AI-Tutor concept (implemented in JavaScript logic) to provide specific, context-aware feedback.  

1. Interactive Parameters  
   - Energy Slider (E): Control the particle's energy.  

   - Width Slider (L): Control the barrier's thickness.  

   - The Calculated Probability (T) display updates instantly with every slider change.  

2. Predictive Visualization (The Quantum Observer)  
Before the player clicks "Initiate Tunnel Attempt," the system provides a probabilistic forecast:  

   - An overlay displays the Predicted Tunnel Probability percentage.  

   - The color of the prediction changes (Red for low probability, Green for high probability), giving the user an immediate visual cue about their odds.  

3. Adaptive AI Tutor Feedback  
The "AI Quantum Tutor Feedback" panel analyzes the result of the random roll and the player's initial inputs, providing educational commentary:  

   - Success Analysis: Explains why the tunnel succeeded (e.g., "Good job keeping L low!") or notes if it was a "lucky shot" despite low odds.  

   - Reflection Advice: If the particle fails to tunnel, the AI specifically points out the most limiting factor (e.g., "The barrier is too thick. Try reducing Barrier Width (L).")  

4. Real-Time Visualization  
The particle animates its approach to the barrier. The final outcome is visualized as the particle either passes through (turns Green) or reflects back (turns Red), verifying the random, probabilistic result against the calculated odds.  

## 🚀 How to Run the Project  

1. Clone the Repository:  

   git clone [https://github.com/shravya1125/The-Quantum-Leaper.git](https://github.com/shravya1125/The-Quantum-Leaper.git)

2. Open the File:  
Navigate to the project directory and open index.html directly in any modern web browser (Chrome, Firefox, Edge, etc.).  

No server, external dependencies, or build tools are required.  

## 🛠️ Technology Stack
- HTML5: Structure  

- Tailwind CSS (via CDN): Styling and responsive design  

- JavaScript (ES6+): Game logic, physics calculation, animation loop (requestAnimationFrame), and AI feedback system.
