let totalCarbonFootprint = 0;
let devices = [];
let regionalCarbonFootprint = 0;
let acCarbonFootprint = 0;

function setPower() {
    const device = document.getElementById('device');
    const power = device.options[device.selectedIndex].getAttribute('data-power');
    document.getElementById('power').value = power;
}

function addDevice() {
    const device = document.getElementById('device');
    const power = document.getElementById('power').value;
    const hours = document.getElementById('hours').value;
    const days = document.getElementById('days').value;

    if (device.value && power && hours && days) {
        const deviceName = device.options[device.selectedIndex].text;
        const kWhPerMonth = (power * hours * days) / 1000;
        const carbonFootprint = kWhPerMonth * 0.92; // 0.92 kg CO2 per kWh (average value)

        devices.push({ name: deviceName, power, hours, days, carbonFootprint });
        updateDeviceList();
        updateTotalResult();
    } else {
        alert('Mohon isi semua bidang input.');
    }
}

function updateDeviceList() {
    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = '';

    devices.forEach((device, index) => {
        const deviceItem = document.createElement('div');
        deviceItem.className = 'device-item';
        deviceItem.innerHTML = `
            ${device.name} - ${device.carbonFootprint.toFixed(2)} kg CO2
            <button onclick="removeDevice(${index})">Hapus</button>
        `;
        deviceList.appendChild(deviceItem);
    });
}

function removeDevice(index) {
    devices.splice(index, 1);
    updateDeviceList();
    updateTotalResult();
}

function calculateRegionalCarbonFootprint() {
    const region = document.getElementById('region').value;
    const limit = document.getElementById('limit').value;

    if (region && limit) {
        const kWhPerMonth = (limit * 30 * 24) / 1000; // Asumsi penggunaan penuh 24 jam sehari selama 30 hari
        regionalCarbonFootprint = kWhPerMonth * 0.92; // 0.92 kg CO2 per kWh (average value)
        const treesNeeded = Math.ceil(regionalCarbonFootprint / 21); // 21 kg CO2 per tree per year

        document.getElementById('regionalResult').innerText = `Jaringan Listrik: ${region}\nBatas Daya: ${limit} VA\nJejak karbon bulanan: ${regionalCarbonFootprint.toFixed(2)} kg CO2\nJumlah pohon yang dibutuhkan per bulan: ${treesNeeded}`;
        updateTotalResult();
    } else {
        document.getElementById('regionalResult').innerText = 'Mohon isi semua bidang input.';
    }
}

function calculateACCarbonFootprint() {
    const acCapacity = document.getElementById('acCapacity').value;
    const acCount = document.getElementById('acCount').value;
    const acHours = document.getElementById('acHours').value;
    const acDays = document.getElementById('acDays').value;

    if (acCapacity && acCount && acHours && acDays) {
        const power = acCapacity * 735; // 1 PK = 735 Watt
        const kWhPerMonth = (power * acCount * acHours * acDays) / 1000;
        acCarbonFootprint = kWhPerMonth * 0.92; // 0.92 kg CO2 per kWh (average value)
        const treesNeeded = Math.ceil(acCarbonFootprint / 21); // 21 kg CO2 per tree per year

        document.getElementById('acResult').innerText = `Jejak karbon bulanan: ${acCarbonFootprint.toFixed(2)} kg CO2\nJumlah pohon yang dibutuhkan per bulan: ${treesNeeded}`;
        updateTotalResult();
    } else {
        document.getElementById('acResult').innerText = 'Mohon isi semua bidang input.';
    }
}

function updateTotalResult() {
    const totalDeviceCarbon = devices.reduce((total, device) => total + device.carbonFootprint, 0);
    totalCarbonFootprint = totalDeviceCarbon + regionalCarbonFootprint + acCarbonFootprint;
    const totalTreesNeeded = Math.ceil(totalCarbonFootprint / 21); // 21 kg CO2 per tree per year

    document.getElementById('totalResult').innerText = `
        Total Emisi Karbon dari Alat Elektronik: ${totalDeviceCarbon.toFixed(2)} kg CO2
        Total Emisi Karbon dari Konsumsi Listrik Wilayah: ${regionalCarbonFootprint.toFixed(2)} kg CO2
        Total Emisi Karbon dari AC/Pendingin Ruangan: ${acCarbonFootprint.toFixed(2)} kg CO2
        Total Emisi Karbon: ${totalCarbonFootprint.toFixed(2)} kg CO2
        Jumlah pohon yang dibutuhkan per bulan: ${totalTreesNeeded}
    `;
}

function resetResults() {
    totalCarbonFootprint = 0;
    devices = [];
    regionalCarbonFootprint = 0;
    acCarbonFootprint = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('regionalResult').innerText = '';
    document.getElementById('acResult').innerText = '';
    document.getElementById('totalResult').innerText = '';
    document.getElementById('deviceList').innerHTML = '';
}