import { AppController } from './app.controller';
import { RabbitmqService } from './rabbitmq.service';

describe('AppController', () => {
  it('publishes message and returns eventId', async () => {
    const publish = jest.fn().mockResolvedValue(undefined);
    const controller = new AppController({
      publish,
    } as unknown as RabbitmqService);

    const result = await controller.send({ message: 'Hello' });

    expect(result.eventId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventId: result.eventId,
        message: 'Hello',
      }),
    );
  });
});
