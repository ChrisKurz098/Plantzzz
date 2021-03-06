//this must be required in server.js

module.exports = {
  imageFile: commonName => {
    return commonName
      .replace(/ /g, '_')
      .toLowerCase();
  },

  //Transforms common_name so it can be used in URL links
  plantURL: commonName => {
    return commonName
      .replace(/ /g, '-')
      .toLowerCase();
  },
  // Convert water frequency to days from Database
  waterFreq: (interval, dayFlag, weeksAsDays) => {
    const day = Math.floor(interval % 7);
    let week = Math.floor(interval / 7);
    if (weeksAsDays) week = week * 7;

    return dayFlag ? day : week;
  },
  // Convert watering frequency interval to days
  suggestedDay: (dbInterval) => {
    let day = Math.floor(dbInterval % 7);
    if (!day) {
      day = 0
    }
    return day;
  },
  // Convert watering frequency to weeks
  suggestedWeek: (dbInterval) => {
    let week = Math.floor(dbInterval / 7);
    if (!week) {
      week = 0
    }
    return week;
  },

  //check all userPlants for watering days
  renderUserPlants: (userPlants) => {
    let dates = [];
    //populate dates array with date keys for 14days, each with an empty plants array and a noTask flag
    for (i = 0; i < 29; i++) {
      let newDate = new Date();
      newDate.setDate(newDate.getDate() + i);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      dates.push({ date: newDate.toLocaleDateString("en-US", options), plants: [], noTasks: false });
      //populate dates[i].plants with the plants for each day
      userPlants.forEach(plant => {
        //get inital water date
        const firstWaterDate = new Date(plant.initial_water_date);
        //get how many days since inital water date
        const diff = getDifferenceInDays(newDate, firstWaterDate);
        //if there is no remainder, then current date is a day of watering
        (diff % plant.watering_interval || !plant.watering_interval) ? false : dates[i].plants.push('Water ' + plant.nickname);
      })
      //if the the current date has no plants, set the noTask flag to true
      //this tells handlebars to format the list item differently
      if (!dates[dates.length - 1].plants[0]) dates[dates.length - 1].noTasks = true;
    }
    return dates;
  },

  //check userPlant need water today
  checkWaterStatus: (userPlant) => {
    let todaysDate = new Date();
    const firstWaterDate = new Date(userPlant.initial_water_date);
    const diff = getDifferenceInDays(todaysDate, firstWaterDate);
    let needsWater = [0];
    //if there is no remainder, then current date is a day of watering
    (diff % userPlant.watering_interval || !userPlant.watering_interval ) ? false : needsWater = [1];
    return needsWater;
  }
};

//get diff in days from inital water date
function getDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}