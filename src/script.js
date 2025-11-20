document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const searchBar = document.getElementById('search-bar');
  let talks = [];

  fetch('talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
    });

  searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = talks.filter(talk => 
      talk.categories.some(category => category.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  function renderSchedule(talksToRender) {
    scheduleContainer.innerHTML = '';
    
    const scheduleWithBreaks = getFullSchedule(talksToRender);

    scheduleWithBreaks.forEach(item => {
      const card = document.createElement('div');
      if (item.isBreak) {
        card.className = 'break-card';
        card.innerHTML = `<strong>${item.title}</strong>`;
      } else {
        card.className = 'talk-card';
        card.innerHTML = `
          <div class="talk-meta">
            <span class="time">${item.startTime} - ${item.endTime}</span>
            <span class="speakers">${item.speakers.join(', ')}</span>
          </div>
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <div class="talk-categories">
            ${item.categories.map(category => `<span class="category">${category}</span>`).join('')}
          </div>
        `;
      }
      scheduleContainer.appendChild(card);
    });
  }
  
  function getFullSchedule(talks) {
      const fullSchedule = [];
      let lastTalkEndTime = new Date("1970-01-01T10:00:00");

      talks.forEach((talk, index) => {
          const talkStartTime = new Date(`1970-01-01T${convertTimeTo24Hour(talk.startTime)}`);
          
          if (talkStartTime > lastTalkEndTime) {
              const breakDuration = (talkStartTime - lastTalkEndTime) / (1000 * 60);
              if (breakDuration > 0) {
                  if (breakDuration > 50) { // Lunch Break
                    fullSchedule.push({ title: 'Lunch Break', isBreak: true });
                  } else { // Short break
                    fullSchedule.push({ title: 'Break', isBreak: true });
                  }
              }
          }
          
          fullSchedule.push(talk);
          lastTalkEndTime = new Date(`1970-01-01T${convertTimeTo24Hour(talk.endTime)}`);
      });

      return fullSchedule;
  }
  
  function convertTimeTo24Hour(time) {
    let [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
});
