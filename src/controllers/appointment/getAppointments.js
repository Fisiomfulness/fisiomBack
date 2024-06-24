const moment = require('moment');
const Appointment = require('../../models/Appointment');


const getAppointments = async (req, res) => {
    try {
        const { 
            from = '',
            to = '',
            _professional = '',
            _patient = '',
            status = '',
        } = req.query;
        
        // every request must have "from" date and "to" date
        if (!moment(from).isValid() || !moment(to).isValid()) {
            return res.status(400).json({
                message: 'Debe proveer una fecha inicial "from:" y final "to:" válida',
            });
        }

        // initiate the query object with date filters
        let appointmentQuery = { 
            fromDateTime: { $gt: from }, 
            toDateTime: { $lt: to }  
        };

        // if _professional or _patient are provided, add them to the query
        if (_professional) {
            appointmentQuery = { ...appointmentQuery, _professional };
        }
        if (_patient) {
            appointmentQuery = { ...appointmentQuery, _patient };
        }

        // if status is provided, add it to the query
        if (status) {
            appointmentQuery = { ...appointmentQuery, status };
        
        // else it is a standard query: include all ACCEPTED, and PENDING if not expired yet
        } else {
            appointmentQuery = { 
                ...appointmentQuery, 
                $or: [
                    { status: "ACCEPTED" },
                    { 
                        $and: [
                            { status: "PENDING" },
                            { expiration: { $gt: Date.now() } }
                        ]
                    }
                ] 
            };
        }

        // execute the query and return appointments in response
        const appointments = await Appointment.find(appointmentQuery);
        return res.status(200).json({ appointments });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = { getAppointments };