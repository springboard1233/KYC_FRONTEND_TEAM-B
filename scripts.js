/* ---------- Extract Data demo handlers ---------- */
const STORAGE_KEY = 'auditTrail'; // only one source of truth

document.addEventListener("DOMContentLoaded", () => {
  initVerificationPage();
  initCompliancePage();

  // Aadhaar
  const extractAadhaar = document.getElementById('extractAadhaar');
  if (extractAadhaar) {
    extractAadhaar.addEventListener('click', () => {
      runExtraction('Aadhaar', 'statusAadhaar');
    });
  }

  // PAN
  const extractPan = document.getElementById('extractPan');
  if (extractPan) {
    extractPan.addEventListener('click', () => {
      runExtraction('PAN Card', 'statusPan');
    });
  }

  // Driving License
  const extractDL = document.getElementById('extractDL');
  if (extractDL) {
    extractDL.addEventListener('click', () => {
      runExtraction('Driving License', 'statusDL');
    });
  }

  // Initialize uploads & previews
  setupUpload('aadhaarFile','previewWrapAadhaar','previewImgAadhaar','previewNameAadhaar','extractAadhaar','statusAadhaar','Aadhaar');
  setupUpload('panFile','previewWrapPan','previewImgPan','previewNamePan','extractPan','statusPan','PAN');
  setupUpload('dlFile','previewWrapDL','previewImgDL','previewNameDL','extractDL','statusDL','DL');

  if (document.getElementById('aadhaarFile')) setupPreview('aadhaarFile','previewWrapAadhaar','previewImgAadhaar','previewNameAadhaar','extractAadhaar');
  if (document.getElementById('panFile'))     setupPreview('panFile','previewWrapPan','previewImgPan','previewNamePan','extractPan');
  if (document.getElementById('dlFile'))      setupPreview('dlFile','previewWrapDL','previewImgDL','previewNameDL','extractDL');

  document.querySelectorAll('.upload-card-section .btn.cancel').forEach(btn=>{
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = btn.closest('.upload-card-section');
      if (!sec) return;
      const input = sec.querySelector('input[type="file"]');
      const preview = sec.querySelector('.preview');
      const img = sec.querySelector('img');
      const nameEl = sec.querySelector('.preview .muted.small') || sec.querySelector('.preview p');
      const extractBtn = sec.querySelector('button.btn.primary');
      const status = sec.querySelector('.status');

      if (input) {
        input.value = '';
        if (input._prevUrl) {
          try { URL.revokeObjectURL(input._prevUrl); } catch(e){}
          input._prevUrl = null;
        }
      }
      if (preview) preview.style.display = 'none';
      if (img) img.src = ''; 
      if (nameEl) nameEl.textContent = '';
      if (extractBtn) extractBtn.disabled = true;
      if (status) status.textContent = '';
    });
  });

  // Initialize result page if present
  if (document.getElementById('resultCard')) initResultPage();
  // Initialize upload page if present
  if (document.getElementById('extractBtn')) initUploadPage();
});


function runExtraction(type, statusId) {
  const status = document.getElementById(statusId);
  if (status) {
    status.textContent = `Extracting ${type} data... please wait`;
  }

  setTimeout(() => {
    if (status) {
      status.textContent = `${type} data extracted successfully ✅`;
    }
  }, 2000);
}

function setupUpload(inputId, previewWrapId, previewImgId, previewNameId, extractBtnId, statusId, storageKey) {
  const fileInput = document.getElementById(inputId);
  const previewWrap = document.getElementById(previewWrapId);
  const previewImg = document.getElementById(previewImgId);
  const previewName = document.getElementById(previewNameId);
  const extractBtn = document.getElementById(extractBtnId);
  const status = document.getElementById(statusId);

  if (!fileInput || !extractBtn || !status) return;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    previewName.textContent = `${file.name} • ${(file.size/1024/1024).toFixed(2)} MB`;

    if (file.type.startsWith('image/')) {
      previewImg.src = URL.createObjectURL(file);
      previewWrap.style.display = 'block';
    } else {
      previewImg.src = '';
      previewImg.alt = 'File selected (no preview)';
      previewWrap.style.display = 'block';
    }

    extractBtn.disabled = false;
    status.textContent = '';
  });

  extractBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
      status.textContent = 'Please select a file first.';
      return;
    }

    extractBtn.disabled = true;
    status.textContent = 'Uploading and extracting...';

    try {
      let mock;
      if(storageKey === 'Aadhaar') {
        mock = {
          name: 'Vedhika Bhatnagar',
          dob: ' 29-09-2002',
          gender: 'Male',
          aadhaar: '3767 0517 8982',
          address: 'H.No. 46, Rhagavan Zila, Adoni'
        };
      } else if(storageKey === 'PAN') {
        mock = {
          name: 'Ramesh Kumar',
          pan: 'ABCDE1234F',
          fatherName: 'Rajesh Kumar',
          age: 33
        };
      } else if(storageKey === 'DL') {
        mock = {
          name: 'Ramesh Kumar',
          address: 'H-12, Sector 23, Gurugram, Haryana - 122001',
          transport: 'Private',
          validity: '2030-12-31'
        };
      }

      localStorage.setItem('extractedDoc', JSON.stringify({ type: storageKey, data: mock }));
      localStorage.setItem('extractedDocType', storageKey);

      status.textContent = 'Extraction complete. Redirecting to result...';
      setTimeout(()=> window.location.href = 'result.html', 1000);

    } catch (err) {
      console.error(err);
      status.textContent = 'Extraction failed.';
    } finally {
      extractBtn.disabled = false;
    }
  });
}

// Removed duplicate mockExtractAPI definition
function mockExtractAPI(file, type) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'Ramesh Kumar',
        dob: '12/04/1990',
        gender: 'Male',
        aadhaar: type === 'Aadhaar' ? '1234 5678 9012' : 'N/A',
        pan: type === 'PAN' ? 'ABCDE1234F' : 'N/A',
        dl: type === 'DL' ? 'DL-0420110149643' : 'N/A',
        address: 'H-12, Sector 23, Gurugram, Haryana - 122001'
      });
    }, 900);
  });
}


// Initialize all
document.addEventListener('DOMContentLoaded', () => {
  setupUpload('aadhaarFile','previewWrapAadhaar','previewImgAadhaar','previewNameAadhaar','extractAadhaar','statusAadhaar','Aadhaar');
  setupUpload('panFile','previewWrapPan','previewImgPan','previewNamePan','extractPan','statusPan','PAN');
  setupUpload('dlFile','previewWrapDL','previewImgDL','previewNameDL','extractDL','statusDL','DL');
});


/* ---------------- Upload Page ---------------- */
function initUploadPage() {
  const fileInput = document.getElementById('aadhaarFile');
  const previewWrap = document.getElementById('previewWrap');
  const previewImg = document.getElementById('previewImg');
  const previewName = document.getElementById('previewName');
  const extractBtn = document.getElementById('extractBtn');
  const status = document.getElementById('status');

  fileInput.addEventListener('change', () => {
    const f = fileInput.files[0];
    if (!f) return;
    previewName.textContent = `${f.name} • ${(f.size/1024/1024).toFixed(2)} MB`;
    if (f.type.startsWith('image/')) {
      previewImg.src = URL.createObjectURL(f);
      previewWrap.classList.remove('hidden');
    } else {
      previewImg.src = '';
      previewImg.alt = 'File selected (no preview)';
      previewWrap.classList.remove('hidden');
    }
    extractBtn.disabled = false;
    status.textContent = '';
  });

  extractBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
      status.textContent = 'Please select a file first.';
      return;
    }
    extractBtn.disabled = true;
    status.textContent = 'Uploading and extracting...';

    try {
      const mock = await mockExtractAPI(file);
      localStorage.setItem('extractedAadhaar', JSON.stringify(mock));
      status.textContent = 'Extraction complete. Redirecting to result...';
      setTimeout(()=> window.location.href = 'result.html', 700);
    } catch (err) {
      console.error(err);
      status.textContent = 'Extraction failed. See console.';
    } finally {
      extractBtn.disabled = false;
    }
  });
}
/* ---------- Multi-file preview helpers (Aadhaar / PAN / DL) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // initialize previewers if those inputs exist
  if (document.getElementById('aadhaarFile')) setupPreview('aadhaarFile','previewWrapAadhaar','previewImgAadhaar','previewNameAadhaar','extractAadhaar');
  if (document.getElementById('panFile'))     setupPreview('panFile','previewWrapPan','previewImgPan','previewNamePan','extractPan');
  if (document.getElementById('dlFile'))      setupPreview('dlFile','previewWrapDL','previewImgDL','previewNameDL','extractDL');

  // optional: wire cancel buttons to clear the section (if you included cancel anchors/buttons)
  document.querySelectorAll('.upload-card-section .btn.cancel').forEach(btn=>{
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = btn.closest('.upload-card-section');
      if (!sec) return;
      const input = sec.querySelector('input[type="file"]');
      const preview = sec.querySelector('.preview');
      const img = sec.querySelector('img');
      const nameEl = sec.querySelector('.preview .muted.small') || sec.querySelector('.preview p');
      const extractBtn = sec.querySelector('button.btn.primary');

      if (input) {
        input.value = '';
        if (input._prevUrl) {
          try { URL.revokeObjectURL(input._prevUrl); } catch(e){}
          input._prevUrl = null;
        }
      }
      if (preview) preview.style.display = 'none';
      if (img) img.src = ''; 
      if (nameEl) nameEl.textContent = '';
      if (extractBtn) extractBtn.disabled = true;
      const status = sec.querySelector('.status');
      if (status) status.textContent = '';
    });
  });
});

function setupPreview(inputId, previewWrapId, previewImgId, previewNameId, extractBtnId) {
  const input = document.getElementById(inputId);
  const previewWrap = document.getElementById(previewWrapId);
  const previewImg = document.getElementById(previewImgId);
  const previewName = document.getElementById(previewNameId);
  const extractBtn = document.getElementById(extractBtnId);

  if (!input) return;

  // ensure UI starts clean
  if (previewWrap) previewWrap.style.display = 'none';
  if (extractBtn) extractBtn.disabled = true;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    // clean previous objectURL
    if (input._prevUrl) {
      try { URL.revokeObjectURL(input._prevUrl); } catch(e){}
      input._prevUrl = null;
    }

    if (!file) {
      if (previewWrap) previewWrap.style.display = 'none';
      if (extractBtn) extractBtn.disabled = true;
      if (previewImg) previewImg.src = '';
      if (previewName) previewName.textContent = '';
      return;
    }

    // show filename + size
    if (previewName) previewName.textContent = `${file.name} • ${(file.size/1024/1024).toFixed(2)} MB`;

    if (file.type && file.type.startsWith('image/')) {
      // image preview
      const url = URL.createObjectURL(file);
      input._prevUrl = url;
      if (previewImg) {
        previewImg.src = url;
        previewImg.alt = file.name;
        previewImg.style.display = ''; // ensure visible
      }
    } else {
      // not an image (e.g., PDF) — do not set img src (will be broken)
      if (previewImg) {
        previewImg.src = '';
        previewImg.style.display = 'none';
      }
      // Optionally you can show an icon or message; we already set filename above
    }

    if (previewWrap) previewWrap.style.display = 'block';
    if (extractBtn) extractBtn.disabled = false;
  });
}

/* ---------------- Result Page ---------------- */
function genId() {
  return Math.random().toString(36).substring(2, 9);
}

function addAuditEntry(entry) {
  console.log("Audit Log:", entry);
}
function initResultPage() {
  const stored = JSON.parse(localStorage.getItem('extractedDoc') || '{}');
  const type = stored.type;
  const data = stored.data || {};

  const container = document.getElementById('resultCard');
  container.innerHTML = ''; // clear default

  if(type === 'Aadhaar') {
    container.innerHTML = `
      <div><strong>Name</strong><div>${data.name || 'Not found'}</div></div>
      <div><strong>DOB</strong><div>${data.dob || 'Not found'}</div></div>
      <div><strong>Gender</strong><div>${data.gender || 'Not found'}</div></div>
      <div><strong>Aadhaar No</strong><div>${data.aadhaar || 'Not found'}</div></div>
      <div class="full"><strong>Address</strong><div>${data.address || 'Not found'}</div></div>
    `;
  } else if(type === 'PAN') {
    container.innerHTML = `
      <div><strong>Name</strong><div>${data.name || 'Not found'}</div></div>
      <div><strong>PAN</strong><div>${data.pan || 'Not found'}</div></div>
      <div><strong>Father Name</strong><div>${data.fatherName || 'Not found'}</div></div>
      <div><strong>Age</strong><div>${data.age || 'Not found'}</div></div>
    `;
  } else if(type === 'DL') {
    container.innerHTML = `
      <div><strong>Name</strong><div>${data.name || 'Not found'}</div></div>
      <div class="full"><strong>Address</strong><div>${data.address || 'Not found'}</div></div>
      <div><strong>Transport</strong><div>${data.transport || 'Not found'}</div></div>
      <div><strong>Validity Expiry</strong><div>${data.validity || 'Not found'}</div></div>
    `;
  }

  // Confirm & save button
  const confirmBtn = document.getElementById('confirmBtn');
  const saveStatus = document.getElementById('saveStatus');

  confirmBtn.addEventListener('click', async () => {
    confirmBtn.disabled = true;
    saveStatus.innerText = 'Saving to Data Base...';
    try {
      await new Promise(r => setTimeout(r, 700));
      saveStatus.innerText = 'Saved. You can now go to Verification dashboard.';
      const stored = JSON.parse(localStorage.getItem('extractedDoc') || '{}');

addAuditEntry({ 
  decision: 'Saved', 
  score: 0, 
  notes: `User confirmed ${stored.type}`, 
  docId: genId(),
  type: stored.type,      // this stores "Aadhaar", "PAN", or "DL"
  data: stored.data       // this stores the extracted info like name, dob, etc.
});


    } catch {
      saveStatus.innerText = 'Save failed.';
    } finally {
      confirmBtn.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", initResultPage);


/* ---------------- Verification Page ---------------- */
/* ---------------- Verification Page ---------------- */
function initVerificationPage() {
  const runBtn = document.getElementById("runVerify");
  const details = document.getElementById("verificationDetails");

  runBtn.addEventListener("click", () => {
    runBtn.style.display = "none";
    const loading = document.getElementById('verificationLoading');
    loading.style.display = "flex";

    setTimeout(() => {
      loading.style.display = "none";
      details.style.display = "block";

      const storedDoc = JSON.parse(localStorage.getItem('extractedDoc') || '{}');
      const docType = storedDoc.type || 'Unknown';
      startVerification(docType); // pass the type
    }, 5000);
  });
}
function startVerification(docType) {
  // fallback if docType is missing
  docType = docType || localStorage.getItem('extractedDocType') || 'Unknown';

  const tmBar = document.getElementById('tmBar');
  const daBar = document.getElementById('daBar');
  const secBar = document.getElementById('secBar');

  const tmStatus = document.getElementById('tmStatus');
  const daStatus = document.getElementById('daStatus');
  const secStatus = document.getElementById('secStatus');

  const overallTick = document.getElementById('overallTick');
  const overallMsg = document.getElementById('overallMessage');
  const riskBadgeEl = document.getElementById('riskBadge');

  const tmPercent = 20;
  const daPercent = 20;
  const secPercent = 25;

  tmBar.style.width = '0%';
  daBar.style.width = '0%';
  secBar.style.width = '0%';

  setTimeout(() => {
    tmBar.style.width = tmPercent + '%';
    daBar.style.width = daPercent + '%';
    secBar.style.width = secPercent + '%';

    tmStatus.innerText = tmPercent + '%';
    daStatus.innerText = daPercent + '%';
    secStatus.innerText = secPercent + '%';
  }, 100);

  const avg = Math.round((tmPercent + daPercent + secPercent) / 3);
  document.getElementById('overallPercent').innerText = avg + '%';

  if (avg <= 30) {
    riskBadgeEl.innerText = 'HIGH RISK';
    riskBadgeEl.style.backgroundColor = '#ff0000ff';
    riskBadgeEl.style.color = 'white';
    overallMsg.innerText = 'Low confidence — manual review recommended';
    overallMsg.style.color = '#111';
    overallTick.style.display = 'none';
  } else if (avg <= 70) {
    riskBadgeEl.innerText = 'MEDIUM RISK';
    riskBadgeEl.style.backgroundColor = '#ff9800';
    riskBadgeEl.style.color = 'white';
    overallMsg.innerText = 'Medium confidence — manual review possible';
    overallTick.style.display = 'none';
  } else {
    riskBadgeEl.innerText = 'HIGH RISK';
    riskBadgeEl.style.backgroundColor = '#f44336';
    riskBadgeEl.style.color = 'white';
    overallMsg.innerText = 'High confidence — document flagged as suspicious';
    overallTick.style.display = 'block';
  }

  addAlert({
    time: Date.now(),
    name: document.getElementById('verName').innerText || 'Unknown User',
    document: docType,
    reason: 'Auto-check risk assessment',
    score: avg
  });

  addAuditEntry({
    time: Date.now(),
    docId: genId(),
    decision: avg > 70 ? 'Flagged' : 'Review',
    score: avg,
    notes: 'Verification completed for ' + docType
  });
  const runBtn = document.getElementById("runVerify");
const storedDoc = JSON.parse(localStorage.getItem('extractedDoc') || '{}');
if (!storedDoc.type) {
  runBtn.disabled = true;
  runBtn.title = "Please extract a document first.";
}


  if (typeof renderAlerts === "function") renderAlerts();
  if (typeof renderAudit === "function") renderAudit();
}


/* ---------------- Compliance Page ---------------- */
function initCompliancePage() {
  const alertsTableBody = document.querySelector('#alertsTable tbody');
  const auditTableBody = document.querySelector('#auditTable tbody');
  const refreshBtn = document.getElementById('refreshAlerts');
  const exportBtn = document.getElementById('exportCSV');
  const searchInput = document.getElementById('searchAudit');

  function renderAlerts() {
  const alerts = getAlerts();
  alertsTableBody.innerHTML = '';

  alerts.forEach(a => {
    const tr = document.createElement('tr');

    let riskColor = '';
    if (a.score <= 30) riskColor = 'style="background:#4caf50;color:white"';
    else if (a.score <= 70) riskColor = 'style="background:#ff9800;color:white"';
    else riskColor = 'style="background:#f44336;color:white"';

    tr.innerHTML = `
      <td>${new Date(a.time).toLocaleString()}</td>
      <td>${a.name}</td>
      <td>${a.document || 'Unknown'}</td> 
      <td>${a.reason}</td>
      <td ${riskColor}>${a.score}%</td>
      <td><button class="dismissBtn btn">Dismiss</button></td>
    `;

    // Attach click event **passing the button itself**
    tr.querySelector('.dismissBtn').addEventListener('click', function() {
      dismissAlert(a.time, this);
    });

    alertsTableBody.appendChild(tr);
  });
}
renderAudit();
function renderAudit(filterText='') {
  const audit = getAudit();
  auditTableBody.innerHTML = '';

  const rows = audit.filter(r => {
    if (!filterText) return true;
    const ft = filterText.toLowerCase();
    const name = r.data?.name || '';
    const docName = r.type || '';
    return name.toLowerCase().includes(ft) || docName.toLowerCase().includes(ft);
  });

  if (!rows.length) {
    auditTableBody.innerHTML = '<tr><td colspan="3" class="muted">No audit entries</td></tr>';
    return;
  }

  rows.forEach(r => {
    const name = r.data?.name || 'Unknown';
    const docName = r.type || 'Unknown';
    const status = r.status || 'Waiting';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${docName}</td>
      <td>${name}</td>
      <td>
        <select class="statusSelect">
          <option value="Waiting" ${status==='Waiting'?'selected':''}>Waiting</option>
          <option value="Approved" ${status==='Approved'?'selected':''}>Approved</option>
          <option value="Rejected" ${status==='Rejected'?'selected':''}>Rejected</option>
        </select>
      </td>
    `;
    // Listen to admin change
    tr.querySelector('.statusSelect').addEventListener('change', e => {
      updateStatus(r.docId, e.target.value);
    });

    auditTableBody.appendChild(tr);
  });
}


  refreshBtn.addEventListener('click', renderAlerts);
  exportBtn.addEventListener('click', () => {
    const csv = generateAuditCSV();
    downloadTextFile(csv, 'audit-trail.csv');
  });

  searchInput.addEventListener('input', (e)=> renderAudit(e.target.value));

  renderAlerts();
  renderAudit();
}
function updateStatus(docId, newStatus) {
  const audit = getAudit();
  const index = audit.findIndex(a => a.docId === docId);
  if (index !== -1) {
    audit[index].status = newStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(audit));
    renderAudit(); // refresh table
  }
}


/* ---------------- Utilities ---------------- */

function mockExtractAPI(file) {
  return new Promise(resolve => setTimeout(()=> {
    resolve({
      name: 'Vedhika Bhatnagar',
      dob: '29-09-2002',
      gender: 'Male',
      aadhaar: '3767 0517 8982',
      address: 'H.No. 46, Rhagavan Zila, Adoni'
    });
  }, 900));
}
function addAuditEntry(entry){
  const existing = JSON.parse(localStorage.getItem('auditTrail') || '[]');
  const e = { 
    time: new Date().toISOString(), 
    docId: entry.docId || genId(), 
    decision: entry.decision || 'Unknown', 
    score: entry.score || 0,        // use real compliance score
    notes: entry.notes || '', 
    type: entry.type || 'Unknown',  // e.g., 'Aadhaar', 'PAN', 'DL'
    data: entry.data || {}           // the extracted data (name, aadhaar, etc.)
  };
  existing.unshift(e);
  localStorage.setItem('auditTrail', JSON.stringify(existing));
}


function getAudit(){
  return JSON.parse(localStorage.getItem('auditTrail') || '[]');
}

function addAlert(alert){
  const existing = JSON.parse(localStorage.getItem('alerts') || '[]');
  existing.unshift(alert);
  localStorage.setItem('alerts', JSON.stringify(existing));
}

function getAlerts(){
  return JSON.parse(localStorage.getItem('alerts') || '[]');
}

function dismissAlert(time, btn) {
  // Remove alert from localStorage
  let alerts = getAlerts();
  alerts = alerts.filter(a => String(a.time) !== String(time));
  localStorage.setItem('alerts', JSON.stringify(alerts));

  // Remove the row from the table directly
  const row = btn.closest('tr');
  if (row) row.remove();
}


function generateAuditCSV(){
  const rows = getAudit();
  const header = ['Time','Doc ID','Decision','Score','Notes'];
  const lines = [header.join(',')];
  rows.forEach(r => {
    const line = [ `"${new Date(r.time).toLocaleString()}"`, `"${r.docId}"`, `"${r.decision}"`, `"${r.score}"`, `"${String(r.notes||'')}"` ];
    lines.push(line.join(','));
  });
  return lines.join('\n');
}

function downloadTextFile(text, filename){
  const blob = new Blob([text], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function genId(){ return 'DOC-' + Math.random().toString(36).slice(2,9).toUpperCase(); }