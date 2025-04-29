import { RegionRepository } from '../repositories/region.repository';
import { UserRepository } from '../repositories/user.repository';
import { SessionService } from '../services/session.service';
import { RegionService } from '../services/region.service';
import { RegionController } from '../controllers/region.controller';

export function makeRegionController(
  regionRepository: RegionRepository,
  userRepository: UserRepository,
  sessionService: SessionService
): RegionController {
  const userService = new RegionService(
    regionRepository,
    userRepository,
    sessionService
  );
  return new RegionController(userService);
}
