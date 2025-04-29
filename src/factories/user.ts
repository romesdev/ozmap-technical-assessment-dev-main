import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { GeolocationService } from '../services/geolocation.service';
import { SessionService } from '../services/session.service';

export function makeUserController(
  userRepository: UserRepository,
  geolocationService: GeolocationService,
  sessionService: SessionService
): UserController {
  const userService = new UserService(
    geolocationService,
    userRepository,
    sessionService
  );
  return new UserController(userService);
}
