import { AvatarGenerator } from 'random-avatar-generator';
 
const generator = new AvatarGenerator();

export const generateAvatar = () => {
    const avatar = generator.generateRandomAvatar();
    return avatar;
}
