/**
 * These are the statuses that are valid.
 */
const VALID_STATUSES = [
  'Active',
  'Approved',
  'Enrolling by Invitation',
  'In Review',
  'Temporarily Closed to Accrual',
  'Temporarily Closed to Accrual and Intervention'
];

/**
 *  
 * @param {*} trial_status 
 */
const isValidTrialStatusList = (currentTrialStatus) => {
  if (!currentTrialStatus || !Array.isArray(currentTrialStatus) || VALID_STATUSES.length !== currentTrialStatus.length) {
    return false;
  }

  // If a valid status is missing, then return false.
  if (VALID_STATUSES.find(status => !currentTrialStatus.includes(status))) {
    return false;
  }

  return true;
}

module.exports = isValidTrialStatusList;