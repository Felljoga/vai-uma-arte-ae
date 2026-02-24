import { motion } from 'framer-motion';
import { GraduationCap, Play, Clock, Users, Star, Lock, Flame, ArrowRight, Trophy, Sparkles } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Design System do Zero',
    instructor: 'Marina Silva',
    duration: '4h 30min',
    students: 2450,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    premium: false,
    progress: 45,
    category: 'UI/UX',
  },
  {
    id: 2,
    title: 'Ilustração Digital Avançada',
    instructor: 'Pedro Henrique',
    duration: '6h 15min',
    students: 1890,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=400&fit=crop',
    premium: true,
    progress: 0,
    category: 'Ilustração',
  },
  {
    id: 3,
    title: 'Branding Estratégico',
    instructor: 'Ana Beatriz',
    duration: '5h 45min',
    students: 3120,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    premium: true,
    progress: 0,
    category: 'Branding',
  },
  {
    id: 4,
    title: 'Motion Design com After Effects',
    instructor: 'Lucas Mendes',
    duration: '8h 00min',
    students: 1650,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
    premium: false,
    progress: 80,
    category: 'Motion',
  },
];

const achievements = [
  { name: 'Primeiro Curso', icon: '🎓', unlocked: true },
  { name: '10 Cursos Completos', icon: '📚', unlocked: true },
  { name: 'Maratonista', icon: '🏃', unlocked: false },
  { name: 'Mestre do Design', icon: '👑', unlocked: false },
];

export function Education() {
  return (
    <section id="educacional" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            Academia Criativa
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Aprenda com os <span className="gradient-neon">melhores</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Cursos exclusivos, tutoriais práticos e uma jornada gamificada de aprendizado.
          </p>
        </motion.div>

        {/* Gamification Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-6 mb-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-3">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white">2.450</div>
              <div className="text-sm text-zinc-400">Pontos XP</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-3">
                <Flame className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-sm text-zinc-400">Dias Seguidos</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-3">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-sm text-zinc-400">Cursos Completos</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-3">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">Nível 7</div>
              <div className="text-sm text-zinc-400">Criador Avançado</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-sm font-medium text-zinc-400 mb-4">Conquistas</h4>
            <div className="flex flex-wrap gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                      : 'bg-white/5 opacity-50'
                  }`}
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <span className={`text-sm font-medium ${achievement.unlocked ? 'text-white' : 'text-zinc-500'}`}>
                    {achievement.name}
                  </span>
                  {!achievement.unlocked && <Lock className="w-3 h-3 text-zinc-500" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group glass-light rounded-2xl overflow-hidden card-hover"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                
                {/* Play Button */}
                <motion.button
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-6 h-6 text-white fill-white" />
                </motion.button>

                {/* Category */}
                <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-medium">
                  {course.category}
                </span>

                {/* Premium Badge */}
                {course.premium && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Premium
                  </span>
                )}

                {/* Progress */}
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-3">por {course.instructor}</p>
                
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {course.rating}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.button
            className="btn-primary inline-flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explorar todos os cursos
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
