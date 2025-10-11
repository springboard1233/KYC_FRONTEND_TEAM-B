document.addEventListener("DOMContentLoaded", () => {
    const uploadInput = document.getElementById("kycFile");
    const previewArea = document.getElementById("previewArea");
    const verifyBtn = document.getElementById("verifyBtn");
    const docTypeSelect = document.getElementById("docType");
    const extractedDetails = document.getElementById("extractedContainer");
    const detailsJSON = document.getElementById("detailsJSON");

    console.log("✅ Verification.js loaded");

    const currentUser = localStorage.getItem("currentUser") || localStorage.getItem("currentAdmin");
    if (!currentUser) {
        showToast("⚠️ Please log in to upload a document.");
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
    }

    function showToast(message, type = "info", duration = 3000) {
        let container = document.getElementById("toastContainer");
        if (!container) {
            container = document.createElement("div");
            container.id = "toastContainer";
            container.style.position = "fixed";
            container.style.bottom = "20px";
            container.style.left = "50%";
            container.style.transform = "translateX(-50%)";
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.gap = "10px";
            container.style.zIndex = "9999";
            document.body.appendChild(container);
        }

        const colors = {
            success: "rgba(40, 167, 69, 0.95)",
            error: "rgba(220, 53, 69, 0.95)",
            warning: "rgba(255, 193, 7, 0.95)",
            info: "rgba(50, 50, 50, 0.95)"
        };

        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.background = colors[type] || colors.info;
        toast.style.color = "#fff";
        toast.style.padding = "12px 20px";
        toast.style.borderRadius = "8px";
        toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(50px)";
        toast.style.transition = "all 0.4s ease";
        toast.style.fontFamily = "sans-serif";
        toast.style.fontSize = "14px";
        toast.style.cursor = "pointer";

        toast.addEventListener("click", () => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(50px)";
            toast.addEventListener("transitionend", () => toast.remove());
        });

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(50px)";
            toast.addEventListener("transitionend", () => toast.remove());
        }, duration);
    }

    const errorBox = document.createElement("div");
    errorBox.style.color = "red";
    errorBox.style.marginTop = "10px";
    uploadInput.parentElement.appendChild(errorBox);

    // Track last verified file and charts
    let lastVerifiedFileName = null;
    let fraudBarChart = null;
    let fraudPieChart = null;
    let lastResult = null;

    // File upload + preview validation
    uploadInput.addEventListener("change", () => {
        const file = uploadInput.files[0];
        errorBox.textContent = "";
        previewArea.innerHTML = "";

        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            errorBox.textContent = "❌ Invalid file type. Please upload JPEG, PNG, or PDF.";
            uploadInput.value = "";
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2 MB
        if (file.size > maxSize) {
            errorBox.textContent = "❌ File size exceeds 2MB. Please upload a smaller document.";
            uploadInput.value = "";
            return;
        }

        if (file.type === "application/pdf") {
            previewArea.innerHTML = `<p>📄 PDF uploaded successfully: ${file.name}</p>`;
        } else {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewArea.innerHTML = `<img src="${e.target.result}" alt="KYC Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Verification button click
    verifyBtn.addEventListener("click", async() => {
        const file = uploadInput.files[0];
        const docType = docTypeSelect.value;

        if (!file) {
            showToast("❌ Please upload a document first.");
            return;
        }
        if (!docType) {
            showToast("❌ Please select a document type.");
            return;
        }

        // If same file already verified, just display previous result
        if (lastVerifiedFileName === file.name && lastResult) {
            populateData(lastResult, docType);
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);
        const currentUser = localStorage.getItem("currentUser") || localStorage.getItem("currentAdmin");
        formData.append("userEmail", currentUser);

        try {
            console.log("📤 Sending request to backend...");
            const response = await fetch("/api/verify", {
                method: "POST",
                body: formData,
                mode: "cors"
            });

            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (err) {
                showToast("❌ Server sent invalid JSON.");
                return;
            }

            if (!response.ok) {
                showToast(result.error || `❌ Server Error: ${response.status}`);
                return;
            }

            // Save last verified result and filename
            lastResult = result;
            lastVerifiedFileName = file.name;

            populateData(result, docType);

        } catch (error) {
            showToast("❌ Error extracting details: " + error.message);
        }
    });

    function populateData(result, docType) {
        const data = result.extracted_data || {};

        document.getElementById("detailName").textContent = data.name || "N/A";

        const dobField = document.getElementById("dobField");
        if (docType === "aadhaar" || docType === "pan") {
            document.getElementById("detailDob").textContent = data.dob || "N/A";
            dobField.style.display = "block";
        } else {
            document.getElementById("detailDob").textContent = "";
            dobField.style.display = "none";
        }

        const addressField = document.getElementById("addressField");
        if (docType === "aadhaar" || docType === "driving_license") {
            document.getElementById("detailAddress").textContent = data.address || "N/A";
            addressField.style.display = "block";
        } else {
            document.getElementById("detailAddress").textContent = "";
            addressField.style.display = "none";
        }

        // Hide optional fields
        document.getElementById("aadhaarNumberField").style.display = "none";
        document.getElementById("panNumberField").style.display = "none";
        document.getElementById("dlNumberField").style.display = "none";
        document.getElementById("issuedOnField").style.display = "none";
        document.getElementById("genderField").style.display = "none";

        if (docType === "aadhaar") {
            document.getElementById("aadhaarNumberField").style.display = "block";
            document.getElementById("genderField").style.display = "block";
            document.getElementById("detailAadhaar").textContent = data.aadhaar_number || "N/A";
            document.getElementById("detailGender").textContent = data.gender || "N/A";
        } else if (docType === "pan") {
            document.getElementById("panNumberField").style.display = "block";
            document.getElementById("detailPan").textContent = data.pan_number || "N/A";
        } else if (docType === "driving_license") {
            document.getElementById("dlNumberField").style.display = "block";
            document.getElementById("issuedOnField").style.display = "block";
            document.getElementById("detailDL").textContent = data.dl_number || "N/A";
            document.getElementById("detailIssued").textContent = data.issued_on || "N/A";
        }

        const fraudContainer = document.getElementById("fraudContainer");
        const fraudScoreEl = document.getElementById("fraudScore");
        const fraudLevelEl = document.getElementById("fraudLevel");
        const fraudNotesEl = document.getElementById("fraudNotes");

        function getRiskLevel(score) {
            if (score <= 30) return "Low";
            else if (score <= 70) return "Medium";
            else return "High";
        }

        const fraudScore = result.fraud_score !== undefined ? result.fraud_score : 0;
        const fraudLevel = getRiskLevel(fraudScore);

        fraudScoreEl.textContent = fraudScore;
        fraudLevelEl.textContent = fraudLevel;
        fraudNotesEl.textContent = `This score is based on document authenticity, tampering, and duplication checks.`;
        fraudContainer.style.display = "block";

        // Bar Chart
        const barCtx = document.getElementById("fraudBarChart").getContext("2d");
        if (fraudBarChart) fraudBarChart.destroy();
        fraudBarChart = new Chart(barCtx, {
            type: "bar",
            data: {
                labels: ["Authenticity", "Tampering", "Duplicate KYC"],
                datasets: [{
                    label: "Risk %",
                    data: [
                        result.authenticity_risk || 0,
                        result.tampering_risk || 0,
                        result.duplicate_risk || 0
                    ],
                    backgroundColor: ["#4caf50", "#ff9800", "#f44336"]
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true, max: 100 } }
            }
        });

        // Pie Chart
        const pieCtx = document.getElementById("fraudPieChart").getContext("2d");
        if (fraudPieChart) fraudPieChart.destroy();
        fraudPieChart = new Chart(pieCtx, {
            type: "pie",
            data: {
                labels: ["Verified", "Unverified"],
                datasets: [{
                    data: [100 - fraudScore, fraudScore],
                    backgroundColor: ["#4caf50", "#f44336"]
                }]
            },
            options: { responsive: true }
        });

        extractedDetails.style.display = "block";
        setTimeout(() => {
            extractedDetails.classList.add("show");
            setTimeout(() => {
                extractedDetails.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 400);
        }, 100);
    }

    previewArea.addEventListener("click", () => uploadInput.click());

    const submitKycBtn = document.getElementById("submitKycBtn");
    submitKycBtn.addEventListener("click", async() => {
        const currentUser = localStorage.getItem("currentUser") || localStorage.getItem("currentAdmin");
        if (!currentUser) {
            showToast("⚠️ Please log in to submit KYC.");
            return;
        }

        const docType = docTypeSelect.value;
        if (!docType) {
            showToast("❌ No document type selected.");
            return;
        }

        let extractedData = {};
        if (docType === "aadhaar") {
            extractedData = {
                name: document.getElementById("detailName").textContent,
                dob: document.getElementById("detailDob").textContent,
                aadhaar_number: document.getElementById("detailAadhaar").textContent,
                gender: document.getElementById("detailGender").textContent,
                address: document.getElementById("detailAddress").textContent
            };
        } else if (docType === "pan") {
            extractedData = {
                name: document.getElementById("detailName").textContent,
                dob: document.getElementById("detailDob").textContent,
                pan_number: document.getElementById("detailPan").textContent
            };
        } else if (docType === "driving_license") {
            extractedData = {
                name: document.getElementById("detailName").textContent,
                dl_number: document.getElementById("detailDL").textContent,
                issued_on: document.getElementById("detailIssued").textContent,
                address: document.getElementById("detailAddress").textContent
            };
        }

        try {
            const response = await fetch("/api/submit-kyc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail: currentUser,
                    docType,
                    extractedData
                })
            });

            const result = await response.json();

            if (!response.ok) {
                showToast(result.error || "❌ Failed to submit KYC");
                return;
            }

            showToast("✅ KYC submitted successfully!", "success");

        } catch (error) {
            showToast("❌ Could not submit KYC: " + error.message);
        }
    });
});