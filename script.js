document.addEventListener('DOMContentLoaded', function () {
  // (1) 자동 콜론 입력
  function autoColonFormat(input) {
    input.addEventListener('input', function () {
      let raw = input.value.replace(/[^0-9]/g, '').slice(0, 6);
      if (raw.length >= 5) input.value = raw.replace(/(\d{2})(\d{2})(\d{0,2})/, '$1:$2:$3');
      else if (raw.length >= 3) input.value = raw.replace(/(\d{2})(\d{0,2})/, '$1:$2');
      else input.value = raw;
    });
  }

  ['rallyRemainTime', 'enemyMarchTime', 'utcTime'].forEach(id => {
    autoColonFormat(document.getElementById(id));
  });

  // (2) useEnemyTimeCheckbox 활성/비활성화
  const useEnemyCheckbox = document.getElementById('useEnemyTimeCheckbox');
  const enemyFields = ['rallyRemainTime', 'enemyMarchTime'];

  function toggleEnemyFields(enabled) {
    enemyFields.forEach(id => {
      const el = document.getElementById(id);
      el.disabled = !enabled;
      el.classList.toggle('bg-gray-200', !enabled);
    });
  }

  useEnemyCheckbox.addEventListener('change', () => toggleEnemyFields(useEnemyCheckbox.checked));
  toggleEnemyFields(useEnemyCheckbox.checked);

  // (3) UTC 자동 입력
  const useUtcCheckbox = document.getElementById('useUtcCheckbox');
  const rallyRemainTime = document.getElementById('rallyRemainTime');
  const utcTimeInput = document.getElementById('utcTime');

  rallyRemainTime.addEventListener('input', () => {
    const value = rallyRemainTime.value.trim();
    const timeFormat = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (useUtcCheckbox.checked && timeFormat.test(value)) {
      const now = new Date();
      const utcHours = String(now.getUTCHours()).padStart(2, '0');
      const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
      const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
      utcTimeInput.value = `${utcHours}:${utcMinutes}:${utcSeconds}`;
    }
  });

  // (4) 리셋 버튼
  document.getElementById('resetRallyRemainTime').addEventListener('click', () => rallyRemainTime.value = '');
  document.getElementById('resetEnemyMarchTime').addEventListener('click', () => document.getElementById('enemyMarchTime').value = '');
  document.getElementById('resetUtcTime').addEventListener('click', () => utcTimeInput.value = '');

  // (5) 설명 복사 버튼
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
      alert('복사에 실패했습니다.');
    });
  }

  document.getElementById("btnCopyExplain").addEventListener("click", () => {
    let explainTexts = [];
    for (let i = 0; i <= 7; i++) {
      const el = document.getElementById(`explain${i}`) || document.getElementById("explainStart1");
      if (el && el.textContent.trim() !== '') explainTexts.push(el.textContent.trim());
    }
    if (explainTexts.length > 0) copyToClipboard(explainTexts.join("\n"));
  });

  // (6) 계산하기 버튼 - explainStart1~explain7 계산
  document.getElementById("btnCalcExplain").addEventListener("click", () => {
    const rallySec = parseTimeToSeconds(rallyRemainTime.value);
    const enemySec = parseTimeToSeconds(document.getElementById('enemyMarchTime').value);
    const utcSec = parseTimeToSeconds(utcTimeInput.value);

    if (rallySec === null || enemySec === null || utcSec === null) {
      alert("모든 시간 입력이 올바른 HH:mm:ss 형식이어야 합니다.");
      return;
    }

    const totalSec = rallySec + enemySec + utcSec;

    // explainStart1 - 파란 글씨
    const explainStartEl = document.getElementById("explainStart1");
    explainStartEl.textContent = "<행군> | 주유시간";
    explainStartEl.classList.add("text-blue-600");

    // explain1~7 - 분·초만 표시 (시 제외)
    const offsets = [30, 35, 40, 45, 50, 55, 60];
    offsets.forEach((offset, idx) => {
      const resultSec = totalSec - offset;
      const minSecText = formatSecondsToMinSec(resultSec);
      const el = document.getElementById(`explain${idx + 1}`);
      if (el) el.textContent = `*${offset}초* | ${minSecText}`;
    });
  });

  // 유틸: HH:mm:ss → 초
  function parseTimeToSeconds(timeStr) {
    const parts = timeStr.trim().split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  // 초 → "분 초" (시간 제외)
  function formatSecondsToMinSec(seconds) {
    if (seconds < 0) seconds = 0;
    const totalMinutes = Math.floor(seconds / 60);
    const s = seconds % 60;
    const m = totalMinutes % 60; // 시간 제외
    return `${m}분 ${s}초`;
  }
});