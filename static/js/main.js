// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdFxsgyJP24qYxTEjoc12c-7JOX9De8Fs",
  authDomain: "sarvalokh-database.firebaseapp.com",
  projectId: "sarvalokh-database",
  storageBucket: "sarvalokh-database.firebasestorage.app",
  messagingSenderId: "310166989987",
  appId: "1:310166989987:web:26121622ad3350df73e316",
  measurementId: "G-91HSXKVS1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Sizing Calibration Data
const sizingData = {
    headless: [
        { code: "U/10", label: "Colossal", weight: "45.4g+ / piece", market: "USA, EU, Japan (Luxury Food Service)", packing: "IQF / Retail Packs", desc: "Under 10 pieces per pound. Extremely large size. Represents the highest premium luxury tier. Perfect for high-end dining." },
        { code: "11/15", label: "Colossal", weight: "30.3g - 41.2g", market: "USA, Western Europe, Middle East", packing: "Block Frozen / IQF", desc: "11 to 15 pieces per pound. Exceptionally robust meat clusters, favored for cocktail prawns and gourmet presentations." },
        { code: "16/20", label: "Jumbo", weight: "22.7g - 28.3g", market: "USA, European Union, UAE", packing: "IQF / Retail Ready", desc: "16 to 20 pieces per pound. The popular standard for premium supermarket skewered packs and restaurant chains." },
        { code: "21/25", label: "Extra Large", weight: "18.1g - 21.6g", market: "USA, China, Vietnam, UAE", packing: "IQF / Polybags", desc: "21 to 25 pieces per pound. Highly versatile size combining premium plate presence with efficient cost-per-serving ratio." },
        { code: "26/30", label: "Large", weight: "15.1g - 17.5g", market: "China, European Union, USA", packing: "Block / IQF", desc: "26 to 30 pieces per pound. Mainstream commercial volume calibrator, highly adaptable for processing and breading." },
        { code: "31/40", label: "Medium Large", weight: "11.3g - 14.6g", market: "USA, EU, Vietnam, China", packing: "IQF / Bulk Packs", desc: "31 to 40 pieces per pound. Excellent retail bag calibration, widely used for stir-fries, curries, and value-added items." },
        { code: "41/50", label: "Medium", weight: "9.1g - 11.0g", market: "Global Volume Markets, Catering", packing: "Block Frozen", desc: "41 to 50 pieces per pound. Standard processing grade for bulk industrial catering and international retail packages." },
        { code: "51/60", label: "Small", weight: "7.6g - 8.9g", market: "Global Distributors, Convenience Food", packing: "Block / Bulk IQF", desc: "51 to 60 pieces per pound. Mass-market distribution size, highly optimized for economy meals, salads, and pizza toppings." }
    ],
    headon: [
        { code: "10/20", label: "Super Colossal", weight: "50.0g - 100.0g", market: "Japan, Southern Europe (Spain, Italy)", packing: "Semi-IQF / Boxed", desc: "10 to 20 pieces per kilogram. Extremely rare premium grade, targeting high-end European tapas and Japanese sashimi trade." },
        { code: "20/30", label: "Colossal", weight: "33.3g - 50.0g", market: "Japan, Spain, France, Italy", packing: "Block Frozen / Boxed", desc: "20 to 30 pieces per kilogram. Head-on selection. Excellent appearance and antenna preservation, ideal for luxury grilling." },
        { code: "30/40", label: "Jumbo HOSO", weight: "25.0g - 33.3g", market: "Southern Europe, Middle East", packing: "Block / Semi-IQF", desc: "30 to 40 pieces per kilogram. Highly demanded in Mediterranean food hospitality networks for visual presentations." },
        { code: "40/50", label: "Large HOSO", weight: "20.0g - 25.0g", market: "EU, China, Vietnam", packing: "Block Frozen", desc: "40 to 50 pieces per kilogram. Standard grading for premium whole cooked programs and wholesale distributors." },
        { code: "50/60", label: "Medium Large", weight: "16.6g - 20.0g", market: "China, Southeast Asia, Middle East", packing: "Block / IQF", desc: "50 to 60 pieces per kilogram. Solid volume export grade, popular in Asian seafood restaurants." },
        { code: "60/70", label: "Medium HOSO", weight: "14.2g - 16.6g", market: "China, UAE, Southern Europe", packing: "Block Frozen", desc: "60 to 70 pieces per kilogram. Economical whole shrimp, suited for stir-fries, hotpot displays, and retail trays." },
        { code: "70/80", label: "Small HOSO", weight: "12.5g - 14.2g", market: "Vietnam, Global Catering", packing: "Block Frozen", desc: "70 to 80 pieces per kilogram. Mass catering standard for whole shrimp boils and regional distributions." },
        { code: "80/100", label: "Extra Small", weight: "10.0g - 12.5g", market: "Global Distributors, Canning", packing: "Block / Bulk Packs", desc: "80 to 100 pieces per kilogram. Budget-friendly whole shrimp utilized for wholesale processors and canning industries." }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Header Functionality
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close mobile menu when clicking nav links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    // 3. Sizing Widget Navigation & Rendering
    const tabHeadless = document.getElementById('tab-headless');
    const tabHeadon = document.getElementById('tab-headon');
    const matrixGrid = document.getElementById('matrix-grid-container');
    const detailsPanel = document.getElementById('size-details-panel');

    function renderSizingMatrix(type) {
        if (!matrixGrid) return;
        matrixGrid.innerHTML = '';
        const items = sizingData[type];

        items.forEach((item, index) => {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.setAttribute('data-index', index);
            cell.setAttribute('data-type', type);
            cell.innerHTML = `
                <span class="cell-code">${item.code}</span>
                <span class="cell-lbl">${item.label}</span>
            `;

            cell.addEventListener('click', () => {
                // Clear active cell
                document.querySelectorAll('.matrix-cell').forEach(c => c.classList.remove('active-cell'));
                // Set active cell
                cell.classList.add('active-cell');
                // Display details
                showSizeDetails(item, type);
            });

            matrixGrid.appendChild(cell);
        });

        // Trigger click on first cell to populate details initially
        if (matrixGrid.firstElementChild) {
            matrixGrid.firstElementChild.click();
        }
    }

    function showSizeDetails(item, type) {
        if (!detailsPanel) return;
        const weightUnit = type === 'headless' ? 'Pound (lb)' : 'Kilogram (kg)';
        detailsPanel.innerHTML = `
            <div class="details-container">
                <h4>Calibration: ${item.code}</h4>
                <div class="detail-row">
                    <span class="detail-label">Commercial Category</span>
                    <span class="detail-value">${item.label}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Pieces per ${weightUnit}</span>
                    <span class="detail-value">${item.code.replace('U/', 'Under ')} pcs</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Avg. Weight per Piece</span>
                    <span class="detail-value">${item.weight}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Primary Markets</span>
                    <span class="detail-value">${item.market}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Standard Packaging</span>
                    <span class="detail-value">${item.packing}</span>
                </div>
                <div class="detail-row" style="flex-direction: column; align-items: flex-start; gap: 0.5rem; border: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08);">
                    <span class="detail-label">Export Market Characteristics:</span>
                    <p style="font-size: 0.9rem; color: rgba(255,255,255,0.85); line-height: 1.5; font-style: italic;">"${item.desc}"</p>
                </div>
            </div>
        `;
    }

    if (tabHeadless && tabHeadon) {
        tabHeadless.addEventListener('click', () => {
            tabHeadon.classList.remove('active');
            tabHeadless.classList.add('active');
            renderSizingMatrix('headless');
        });

        tabHeadon.addEventListener('click', () => {
            tabHeadless.classList.remove('active');
            tabHeadon.classList.add('active');
            renderSizingMatrix('headon');
        });

        // Initial setup
        renderSizingMatrix('headless');
    }

    // 4. Product Select Connection to RFQ Form
    const productCardBtns = document.querySelectorAll('.btn-card-rfq');
    const rfqProductSelect = document.getElementById('product-type');

    productCardBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetProduct = btn.getAttribute('data-product');
            if (rfqProductSelect) {
                rfqProductSelect.value = targetProduct;
            }
            
            const rfqSection = document.getElementById('rfq');
            if (rfqSection) {
                rfqSection.scrollIntoView({ behavior: 'smooth' });
                
                // Focus on the first form field
                setTimeout(() => {
                    const firstInput = document.getElementById('company_name');
                    if (firstInput) firstInput.focus();
                }, 800);
            }
        });
    });

    // 5. Interactive RFQ Form Submission (AJAX)
    const rfqForm = document.getElementById('rfq-form');
    const statusModal = document.getElementById('form-status-container');
    const statusIcon = document.getElementById('status-icon-element');
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');
    const statusClose = document.getElementById('btn-status-close');
    const submitBtn = document.getElementById('btn-submit-rfq');

    if (rfqForm) {
        rfqForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear errors
            document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
            document.querySelectorAll('input, select, textarea').forEach(el => el.style.borderColor = '');

            // Form data retrieval
            const formData = new FormData(rfqForm);
            const dataObject = {};
            formData.forEach((value, key) => dataObject[key] = value);

            // Basic Client-side validation
            let hasErrors = false;
            const requiredFields = ['company_name', 'contact_name', 'email', 'destination_port', 'product_type', 'processing_format', 'size_grading'];
            
            requiredFields.forEach(field => {
                const value = dataObject[field];
                if (!value || value.trim() === '') {
                    hasErrors = true;
                    showFieldError(field, 'This field is required.');
                }
            });

            if (dataObject.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dataObject.email)) {
                hasErrors = true;
                showFieldError('email', 'Please enter a valid email address.');
            }

            if (hasErrors) return;

            // Submit Form via AJAX Fetch API
            try {
                // Change button state
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Processing Request... <i class="fa-solid fa-circle-notch fa-spin"></i>';

                const response = await fetch('/submit-rfq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataObject)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Save to Firebase Firestore database
                    try {
                        const docRef = await addDoc(collection(db, "rfq_submissions"), {
                            rfq_id: result.rfq_id,
                            company_name: dataObject.company_name,
                            contact_name: dataObject.contact_name,
                            email: dataObject.email,
                            phone: dataObject.phone || '',
                            destination_port: dataObject.destination_port,
                            product_type: dataObject.product_type,
                            processing_format: dataObject.processing_format,
                            size_grading: dataObject.size_grading,
                            freezing_format: dataObject.freezing_format || '',
                            glazing: dataObject.glazing || '',
                            notes: dataObject.notes || '',
                            status: 'Pending Review',
                            timestamp: serverTimestamp()
                        });
                        console.log("RFQ document written to Firebase Firestore with ID: ", docRef.id);
                    } catch (firebaseErr) {
                        console.error("Error writing to Firebase Firestore: ", firebaseErr);
                    }

                    // Success
                    showStatusModal(true, result.message, result.rfq_id);
                    rfqForm.reset();
                } else {
                    // Validation errors from server
                    if (result.errors) {
                        Object.keys(result.errors).forEach(key => {
                            showFieldError(key, result.errors[key]);
                        });
                    } else {
                        showStatusModal(false, result.message || 'Submission failed. Please check form parameters.');
                    }
                }
            } catch (err) {
                showStatusModal(false, 'Network connection issue. Please check your internet connection or email us directly.');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Sourcing Request <i class="fa-solid fa-paper-plane"></i>';
            }
        });
    }

    function showFieldError(fieldId, message) {
        const errorSpan = document.getElementById(`error-${fieldId}`);
        const inputField = document.getElementById(fieldId);
        
        if (errorSpan) {
            errorSpan.textContent = message;
        }
        if (inputField) {
            inputField.style.borderColor = '#e11d48';
        }
    }

    function showStatusModal(isSuccess, message, rfqId = null) {
        if (!statusModal) return;

        if (isSuccess) {
            statusIcon.className = 'status-icon success-icon';
            statusIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            statusTitle.textContent = 'Submission Successful';
            statusMessage.innerHTML = `${message}<br><br><strong>Tracking RFQ ID:</strong> <span style="color: var(--accent-cyan); font-family: monospace;">${rfqId}</span>`;
        } else {
            statusIcon.className = 'status-icon error-icon';
            statusIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
            statusTitle.textContent = 'Submission Failed';
            statusMessage.textContent = message;
        }

        statusModal.classList.add('show-modal');
    }

    if (statusClose && statusModal) {
        statusClose.addEventListener('click', () => {
            statusModal.classList.remove('show-modal');
        });
    }

    // 6. Intro Glimpse Splash Screen Timer (3 Seconds)
    const introOverlay = document.getElementById('intro-glimpse');
    if (introOverlay) {
        // Lock body scrolling initially
        document.body.classList.add('lock-scroll');
        
        // Start timeout to fade out splash screen after 3 seconds
        setTimeout(() => {
            introOverlay.classList.add('fade-out');
            document.body.classList.remove('lock-scroll');
            
            // Remove completely from DOM after fade-out transition is complete
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 800); // matches the 0.8s CSS transition time
        }, 3000);
    }
});

