import { NotFoundError } from '../shared/errors/AppError.js';
import { mapReservationDetail } from './admin.use-cases.js';

export class ListAdvisorsUseCase {
    #advisorRepository;

    constructor(advisorRepository) {
        this.#advisorRepository = advisorRepository;
    }

    async execute() {
        return this.#advisorRepository.findAll();
    }
}

export class AssignAdvisorUseCase {
    #reservationRepository;
    #advisorRepository;

    constructor(reservationRepository, advisorRepository) {
        this.#reservationRepository = reservationRepository;
        this.#advisorRepository = advisorRepository;
    }

    async execute(reservationId, advisorName) {
        const reservation = await this.#reservationRepository.findById(reservationId);
        if (!reservation) {
            throw new NotFoundError('Reserva no encontrada');
        }

        const advisor = await this.#advisorRepository.findByName(advisorName);
        if (!advisor) {
            throw new NotFoundError('Asesor no encontrado');
        }

        const updated = await this.#reservationRepository.update(reservationId, {
            participant: { advisor: advisorName, advisorAssignedByAdmin: true },
        });

        return mapReservationDetail(updated);
    }
}
