import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Today as TodayIcon,
  ViewDay as ViewDayIcon,
  ViewWeek as ViewWeekIcon,
  ViewModule as ViewMonthIcon
} from '@mui/icons-material';

// Componentes estilizados
const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
  height: 'calc(100vh - 180px)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}));

const CalendarHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3)
}));

const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(0.5),
  flexGrow: 1,
  overflow: 'auto'
}));

const DayCell = styled(Box)(({ theme, isToday, isCurrentMonth, hasEvents }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  minHeight: '100px',
  backgroundColor: isToday 
    ? alpha(theme.palette.primary.main, 0.1) 
    : isCurrentMonth 
      ? theme.palette.background.paper 
      : alpha(theme.palette.background.default, 0.5),
  opacity: isCurrentMonth ? 1 : 0.5,
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05)
  }
}));

const DayNumber = styled(Typography)(({ theme, isToday }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: isToday ? theme.palette.primary.main : 'transparent',
  color: isToday ? theme.palette.primary.contrastText : theme.palette.text.primary,
  fontWeight: isToday ? 'bold' : 'regular'
}));

const EventChip = styled(Box)(({ theme, priority }) => {
  const colors = {
    high: theme.palette.error.main,
    medium: theme.palette.warning.main,
    low: theme.palette.success.main,
    default: theme.palette.primary.main
  };
  
  return {
    backgroundColor: colors[priority] || colors.default,
    color: '#fff',
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.75rem',
    marginBottom: theme.spacing(0.5),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer'
  };
});

// Função auxiliar para manipulação de datas
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const getLastDayOfPrevMonth = (year, month) => {
  return new Date(year, month, 0).getDate();
};

const alpha = (color, opacity) => {
  return color + opacity.toString(16).padStart(2, '0');
};

// Dados simulados
const eventData = [
  {
    id: 1,
    title: 'Reunião com equipe de design',
    description: 'Discutir novos layouts e diretrizes de marca',
    startTime: new Date(2025, 3, 18, 14, 0),
    endTime: new Date(2025, 3, 18, 15, 30),
    location: 'Sala de reuniões virtual',
    priority: 'medium'
  },
  {
    id: 2,
    title: 'Call com cliente potencial',
    description: 'Apresentação inicial de serviços',
    startTime: new Date(2025, 3, 18, 16, 30),
    endTime: new Date(2025, 3, 18, 17, 30),
    location: 'Zoom',
    priority: 'high'
  },
  {
    id: 3,
    title: 'Workshop de estratégia',
    description: 'Planejamento para o próximo trimestre',
    startTime: new Date(2025, 3, 19, 10, 0),
    endTime: new Date(2025, 3, 19, 12, 0),
    location: 'Sala de conferências',
    priority: 'high'
  },
  {
    id: 4,
    title: 'Revisão de campanha',
    description: 'Análise de resultados e ajustes',
    startTime: new Date(2025, 3, 20, 9, 0),
    endTime: new Date(2025, 3, 20, 10, 0),
    location: 'Google Meet',
    priority: 'medium'
  },
  {
    id: 5,
    title: 'Almoço com parceiros',
    description: 'Networking e discussão de colaborações',
    startTime: new Date(2025, 3, 21, 12, 30),
    endTime: new Date(2025, 3, 21, 14, 0),
    location: 'Restaurante Central',
    priority: 'low'
  }
];

const Calendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [currentView, setCurrentView] = useState('month');
  const [events, setEvents] = useState(eventData);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Estado para novo evento
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    priority: 'medium'
  });
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const handleViewChange = (view) => {
    setCurrentView(view);
  };
  
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setOpenDialog(true);
    
    // Resetar formulário
    setNewEvent({
      title: '',
      description: '',
      startTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T09:00`,
      endTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T10:00`,
      location: '',
      priority: 'medium'
    });
    
    setSelectedEvent(null);
  };
  
  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setOpenDialog(true);
    
    // Preencher formulário com dados do evento
    const startTime = event.startTime.toISOString().slice(0, 16);
    const endTime = event.endTime.toISOString().slice(0, 16);
    
    setNewEvent({
      title: event.title,
      description: event.description,
      startTime: startTime,
      endTime: endTime,
      location: event.location,
      priority: event.priority
    });
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };
  
  const handleCreateEvent = () => {
    const startTime = new Date(newEvent.startTime);
    const endTime = new Date(newEvent.endTime);
    
    const event = {
      id: selectedEvent ? selectedEvent.id : events.length + 1,
      ...newEvent,
      startTime,
      endTime
    };
    
    if (selectedEvent) {
      // Atualizar evento existente
      setEvents(events.map(e => e.id === selectedEvent.id ? event : e));
    } else {
      // Criar novo evento
      setEvents([...events, event]);
    }
    
    handleCloseDialog();
  };
  
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      handleCloseDialog();
    }
  };
  
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };
  
  // Renderizar calendário mensal
  const renderMonthCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const lastDayOfPrevMonth = getLastDayOfPrevMonth(currentYear, currentMonth);
    
    const days = [];
    
    // Dias do mês anterior
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = lastDayOfPrevMonth - i;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Dias do próximo mês (para completar a grade)
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias = 42
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return (
      <>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
          {weekDays.map((day, index) => (
            <Box 
              key={index} 
              sx={{ 
                textAlign: 'center', 
                py: 1,
                fontWeight: 'medium',
                color: 'text.secondary'
              }}
            >
              {day}
            </Box>
          ))}
        </Box>
        
        <CalendarGrid>
          {days.map(({ date, isCurrentMonth }, index) => {
            const isToday = date.toDateString() === today.toDateString();
            
            // Filtrar eventos para este dia
            const dayEvents = events.filter(event => 
              event.startTime.getDate() === date.getDate() &&
              event.startTime.getMonth() === date.getMonth() &&
              event.startTime.getFullYear() === date.getFullYear()
            );
            
            return (
              <DayCell 
                key={index} 
                isToday={isToday} 
                isCurrentMonth={isCurrentMonth}
                hasEvents={dayEvents.length > 0}
                onClick={() => handleDateClick(date)}
              >
                <DayNumber variant="body2" isToday={isToday}>
                  {date.getDate()}
                </DayNumber>
                
                <Box sx={{ mt: 4 }}>
                  {dayEvents.map(event => (
                    <EventChip 
                      key={event.id} 
                      priority={event.priority}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {`${event.startTime.getHours().toString().padStart(2, '0')}:${event.startTime.getMinutes().toString().padStart(2, '0')} ${event.title}`}
                    </EventChip>
                  ))}
                </Box>
              </DayCell>
            );
          })}
        </CalendarGrid>
      </>
    );
  };
  
  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Calendário
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleDateClick(today)}
        >
          Novo Evento
        </Button>
      </Box>
      
      <CalendarContainer>
        <CalendarHeader>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2 }}>
              {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<TodayIcon />}
              onClick={() => setCurrentDate(today)}
              sx={{ ml: 2 }}
            >
              Hoje
            </Button>
          </Box>
          
          <Box>
            <Tooltip title="Dia">
              <IconButton 
                color={currentView === 'day' ? 'primary' : 'default'} 
                onClick={() => handleViewChange('day')}
              >
                <ViewDayIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Semana">
              <IconButton 
                color={currentView === 'week' ? 'primary' : 'default'} 
                onClick={() => handleViewChange('week')}
              >
                <ViewWeekIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Mês">
              <IconButton 
                color={currentView === 'month' ? 'primary' : 'default'} 
                onClick={() => handleViewChange('month')}
              >
                <ViewMonthIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CalendarHeader>
        
        {currentView === 'month' && renderMonthCalendar()}
        {currentView === 'week' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              Visualização semanal será implementada em breve
            </Typography>
          </Box>
        )}
        {currentView === 'day' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              Visualização diária será implementada em breve
            </Typography>
          </Box>
        )}
      </CalendarContainer>
      
      {/* Dialog para criar/editar evento */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Título"
            type="text"
            fullWidth
            variant="outlined"
            value={newEvent.title}
            onChange={handleEventChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Descrição"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newEvent.description}
            onChange={handleEventChange}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="startTime"
                label="Início"
                type="datetime-local"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newEvent.startTime}
                onChange={handleEventChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="endTime"
                label="Fim"
                type="datetime-local"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newEvent.endTime}
                onChange={handleEventChange}
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            name="location"
            label="Local"
            type="text"
            fullWidth
            variant="outlined"
            value={newEvent.location
(Content truncated due to size limit. Use line ranges to read in chunks)