import moment from "moment"

function calculateFinalScore(
    scale: number,
    magnitude: number,
    potential: number,
    novelty: number,
    significance: number,
    actionability: number,
    longTermConseq: number,

) {
    // Assign weights
    const weights = {
        scale: 0.1,
        magnitude: 0.15,
        potential: 0.15,
        novelty: 0.1,
        significance: 0.2,
        actionability: 0.2,
        longTermConseq: 0.1
    };

    const weightedScale = scale * weights.scale;
    const weightedMagnitude = magnitude * weights.magnitude;
    const weightedPotential = potential * weights.potential;
    const weightedNovelty = novelty * weights.novelty;
    const weightedSignificance = significance * weights.significance;
    const weightedActionability = actionability * weights.actionability;
    const weightedLongTerm = longTermConseq * weights.longTermConseq;

    // Calculate geometric mean
    const product = weightedScale * weightedMagnitude * weightedPotential * weightedNovelty * weightedSignificance *  weightedActionability * weightedLongTerm;
    return Math.pow(product, 1 / 7);
}

function calculateTimeDifference(targetDate: string) {
    const targetDateTime = moment(targetDate, 'MMMM Do, YYYY');

    const currentDate = moment();

    const timeDifference = currentDate.diff(targetDateTime);

    // Calculate the difference in seconds, minutes, hours, and days
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    // Determine how close the target date is to the current date
    let proximity;
    if (days === 0) {
        proximity = 'today';
    } else if (days === 1) {
        proximity = 'yesterday';
    } else if (days === -1) {
        proximity = 'tomorrow';
    } else if (days < -1) {
        proximity = `${days} days from now`;
    } else {
        proximity = `${days} days ago`;
    }

    // Return an object with the time difference and proximity
    return {
        seconds,
        minutes,
        hours,
        days,
        proximity,
    };
}
export async function sleep(ms: number ) {
    await new Promise((r: TimerHandler) => setTimeout(r, ms));
}
function isEmpty(obj: object): boolean {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}
function findNullKeys(obj: { [key: string]: any }): string[] {
    const nullKeys: string[] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === null) {
            nullKeys.push(key);
        }
    }

    return nullKeys;
}
function createLogitBias(): Record<string, number> {
    const logitBias: Record<string, number> = {};
    logitBias['15'] = 100;
    logitBias['16'] = 100;
    logitBias['17'] = 100;
    logitBias['18'] = 100;
    logitBias['19'] = 100;
    logitBias['20'] = 100;
    logitBias['21'] = 100;
    logitBias['22'] = 100;
    logitBias['23'] = 100;
    logitBias['24'] = 100;
    logitBias['605'] = 100;
    return logitBias;
}

function areFloatsEqual(a: number, b: number) {
    return Math.round(a*100000) == Math.round(b*100000);
}
export {
    areFloatsEqual,
    createLogitBias,
    findNullKeys,
    isEmpty,
    calculateTimeDifference,
    calculateFinalScore
}

