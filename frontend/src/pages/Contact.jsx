import { motion } from 'framer-motion';
import { Mail, Phone, GraduationCap, Building2 } from 'lucide-react';

const TeamCard = ({ member, role, icon: Icon, email, phone, institution }) => (
    <motion.div
        className="glass p-6 rounded-2xl text-center"
    >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Icon size={32} />
        </div>
        <h3 className="text-lg font-bold mb-1">{member}</h3>
        <p className="text-primary text-sm font-medium mb-4">{role}</p>

        <div className="text-sm text-gray-300 space-y-2">
            <p className="flex items-center justify-center gap-2">
                <Building2 size={14} /> {institution}
            </p>
            <p className="flex items-center justify-center gap-2">
                <Mail size={14} />
                <a href={`mailto:${email}`} className="hover:text-emerald-400 transition-colors">{email}</a>
            </p>
            <p className="flex items-center justify-center gap-2">
                <Phone size={14} />
                <a href={`tel:${phone}`} className="hover:text-emerald-400 transition-colors">{phone}</a>
            </p>
        </div>
    </motion.div>
);

const Contact = () => {
    return (
        <div className="py-10 space-y-16">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-600">Meet Our Team</h1>
                <p className="text-gray-600">The passionate individuals behind EcoRewards</p>
            </motion.div>

            <section>
                <h2 className="text-2xl font-bold mb-8 text-center text-white">Development & Administration Team</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <TeamCard
                        member="Sreeraj VR" role="Lead Developer" icon={GraduationCap}
                        email="sreeraj.vr@ecorewards.in" phone="+91 9745831269" institution="School of Engineering, CUSAT"
                    />
                    <TeamCard
                        member="Samuel Simon Jose" role="System Administrator" icon={GraduationCap}
                        email="samuel.simon@ecorewards.in" phone="+91 9847562310" institution="School of Engineering, CUSAT"
                    />
                    <TeamCard
                        member="Sharaun Krishna" role="Backend Developer" icon={GraduationCap}
                        email="sharaun.krishna@ecorewards.in" phone="+91 9956234178" institution="School of Engineering, CUSAT"
                    />
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-8 text-center text-white">Management Team</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <TeamCard
                        member="Anjali Menon" role="Project Manager" icon={Building2}
                        email="anjali.menon@ecorewards.in" phone="+91 9847123456" institution="IIM Kozhikode"
                    />
                    <TeamCard
                        member="Rahul Krishnan" role="Operations Manager" icon={Building2}
                        email="rahul.krishnan@ecorewards.in" phone="+91 9956781234" institution="NIT Calicut"
                    />
                </div>
            </section>
        </div>
    );
};

export default Contact;
