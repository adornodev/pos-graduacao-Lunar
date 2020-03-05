import Event from '../models/Event';

class EventController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const eventsDb = await Event.find({
      pothole: true,
    })
      .sort({ created_at: 'desc' })
      .limit(20);

    return res.json(eventsDb);
  }

  async store(req, res) {
    const { pothole, timestamp, latitude, longitude } = req.body;

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const event = await Event.create({
      location,
      timestamp,
      pothole,
    });

    return res.json(event);
  }

  /*
  await NotificationSchema.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });
  
  async update(req, res) {
    // o new: true informa que depois de atualizar, ele retorna e não retorna antes de atualizar.
    const notification = await NotificationSchema.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      { new: true }
    );

    return res.json(notification);
  }

  */
}

export default new EventController();
