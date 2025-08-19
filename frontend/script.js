const BACKEND_URL = 'https://xwjwpiy-traffic-estimator-api.onrender.com/calculate_fare';
const busOptions = [
    "台北市一般公車", "新北市一般公車", "幹線公車", "快速公車",
    "市民小巴", "內科專車", "跳蛙公車"
];

const tripsContainer = document.getElementById('trips_container');
let tripCount = 0;

// 函式：生成一個新的路線輸入框
function addTripRow() {
    tripCount++;
    const row = document.createElement('div');
    row.classList.add('trip-row');
    row.innerHTML = `
        <label>路線 ${tripCount}:</label>
        <select class="bus_type">
            <option value="">請選擇公車種類</option>
            ${busOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
        </select>
        <label>段數：</label>
        <input type="number" class="trip_count" value="1" min="1" max="99">
    `;
    tripsContainer.appendChild(row);
}

// 函式：刪除最後一個路線輸入框
function removeLastTrip() {
    const tripRows = tripsContainer.querySelectorAll('.trip-row');
    if (tripRows.length > 0) {
        tripsContainer.removeChild(tripRows[tripRows.length - 1]);
    }
    tripCount--;
}

// 函式：清空所有路線輸入框
function clearAllTrips() {
    tripsContainer.innerHTML = '';
    document.getElementById('result').textContent = '';
    tripCount = 0;
    addTripRow(); // 清空後，新增一筆預設路線
}

// 監聽「新增路線」按鈕
document.getElementById('addTripBtn').addEventListener('click', () => {
    addTripRow();
});

// 監聽「刪除最後一項」按鈕
document.getElementById('removeLastBtn').addEventListener('click', () => {
    if (tripCount > 1) {
        removeLastTrip();
    }
});

// 監聽「全部清除」按鈕
document.getElementById('clearAllBtn').addEventListener('click', () => {
    clearAllTrips();
});

document.getElementById('calculateBtn').addEventListener('click', async () => {
    const fareType = document.getElementById('fare_type').value;
    const busTrips = [];
    
    const tripRows = document.querySelectorAll('.trip-row');
    if (tripRows.length === 0) {
        document.getElementById('result').textContent = '請至少新增一筆搭乘紀錄。';
        return;
    }

    let hasInvalidInput = false; // 新增一個標誌來追蹤是否有無效輸入
    
    tripRows.forEach(row => {
        const busType = row.querySelector('.bus_type').value;
        const tripCount = parseInt(row.querySelector('.trip_count').value);
        
        if (busType === "" && tripCount > 0) {
            hasInvalidInput = true;
            return;
        }
        if (busType !== "" && tripCount > 0) {
            busTrips.push({
                "bus_type": busType,
                "trip_count": tripCount
            });
        }
    });

    if (hasInvalidInput) {
        document.getElementById('result').textContent = '請填寫有效的公車種類。';
        return;
    }

    if (busTrips.length === 0) {
        document.getElementById('result').textContent = '請填寫有效的搭乘紀錄。';
        return;
    }

    const dataToSend = {
        "fare_type": fareType,
        "bus_trips": busTrips
    };
    
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '計算中...';

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.total_fare !== undefined) {
            resultDiv.textContent = `總票價：${result.total_fare} 元`;
        } else {
            resultDiv.textContent = `錯誤：${result.error}`;
        }
    } catch (error) {
        resultDiv.textContent = `發生錯誤：${error.message}`;
        console.error('Fetch Error:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    addTripRow();
});
