const generateUsername = () =>  {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';

    const getRandomElement = (array: string | any[]) => array[Math.floor(Math.random() * array.length)];

    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    const numberOfSyllables = random(2, 3);
    let username = '';

    for (let i = 0; i < numberOfSyllables; i++) {
        username += getRandomElement(consonants).toUpperCase();
        username += getRandomElement(vowels);
        username += getRandomElement(consonants);
    }
    // @ts-ignore
    return username + crypto.randomUUID();
}

export {
    generateUsername
}