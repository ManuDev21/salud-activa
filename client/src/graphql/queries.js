import { gql } from '@apollo/client';

// ==================== AUTH ====================
export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      usuario {
        id
        nombre
        apellido
        correo
        rol
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: CreateUsuarioInput!) {
    register(input: $input) {
      token
      usuario {
        id
        nombre
        apellido
        correo
        rol
      }
    }
  }
`;

// ==================== USUARIOS ====================
export const GET_USUARIO = gql`
  query GetUsuario($id: Int!) {
    usuario(id: $id) {
      id
      nombre
      apellido
      correo
      fecha_nacimiento
      rol
      created_at
    }
  }
`;

// ==================== CITAS ====================
export const GET_CITAS_BY_USUARIO = gql`
  query CitasByUsuario($usuarioId: Int!) {
    citasByUsuario(usuarioId: $usuarioId) {
      id
      medico
      especialidad
      lugar
      fecha_hora
      estado
      notas
      created_at
    }
  }
`;

export const CREATE_CITA = gql`
  mutation CreateCita($input: CreateCitaInput!) {
    createCita(input: $input) {
      id
      medico
      especialidad
      lugar
      fecha_hora
      estado
    }
  }
`;

export const UPDATE_CITA = gql`
  mutation UpdateCita($input: UpdateCitaInput!) {
    updateCita(input: $input) {
      id
      medico
      especialidad
      lugar
      fecha_hora
      estado
    }
  }
`;

export const REMOVE_CITA = gql`
  mutation RemoveCita($id: Int!) {
    removeCita(id: $id)
  }
`;

// ==================== MEDICAMENTOS ====================
export const GET_MEDICAMENTOS_BY_USUARIO = gql`
  query MedicamentosByUsuario($usuarioId: Int!) {
    medicamentosByUsuario(usuarioId: $usuarioId) {
      id
      nombre
      dosis
      frecuencia
      fecha_inicio
      fecha_fin
      notas
      created_at
    }
  }
`;

export const CREATE_MEDICAMENTO = gql`
  mutation CreateMedicamento($input: CreateMedicamentoInput!) {
    createMedicamento(input: $input) {
      id
      nombre
      dosis
      frecuencia
      fecha_inicio
      fecha_fin
    }
  }
`;

export const UPDATE_MEDICAMENTO = gql`
  mutation UpdateMedicamento($input: UpdateMedicamentoInput!) {
    updateMedicamento(input: $input) {
      id
      nombre
      dosis
      frecuencia
      fecha_inicio
      fecha_fin
    }
  }
`;

export const REMOVE_MEDICAMENTO = gql`
  mutation RemoveMedicamento($id: Int!) {
    removeMedicamento(id: $id)
  }
`;

// ==================== VACUNAS ====================
export const GET_VACUNAS_BY_USUARIO = gql`
  query VacunasByUsuario($usuarioId: Int!) {
    vacunasByUsuario(usuarioId: $usuarioId) {
      id
      nombre
      dosis_aplicada
      fecha_aplicacion
      proxima_dosis_fecha
      notas
      created_at
    }
  }
`;

export const CREATE_VACUNA = gql`
  mutation CreateVacuna($input: CreateVacunaInput!) {
    createVacuna(input: $input) {
      id
      nombre
      dosis_aplicada
      fecha_aplicacion
      proxima_dosis_fecha
    }
  }
`;

export const REMOVE_VACUNA = gql`
  mutation RemoveVacuna($id: Int!) {
    removeVacuna(id: $id)
  }
`;

// ==================== FAMILIARES ====================
export const GET_FAMILIARES_BY_USUARIO = gql`
  query FamiliaresByUsuario($usuarioId: Int!) {
    familiaresByUsuario(usuarioId: $usuarioId) {
      id
      parentesco
      familiarUsuario {
        id
        nombre
        apellido
        correo
      }
    }
  }
`;

export const CREATE_FAMILIAR = gql`
  mutation CreateFamiliar($input: CreateFamiliarInput!) {
    createFamiliar(input: $input) {
      id
      parentesco
    }
  }
`;

export const REMOVE_FAMILIAR = gql`
  mutation RemoveFamiliar($id: Int!) {
    removeFamiliar(id: $id)
  }
`;

// ==================== RECORDATORIOS ====================
export const GET_RECORDATORIOS_BY_USUARIO = gql`
  query RecordatoriosByUsuario($usuarioId: Int!) {
    recordatoriosByUsuario(usuarioId: $usuarioId) {
      id
      tipo
      referencia_id
      fecha_recordatorio
      estado
      created_at
    }
  }
`;

// ==================== ALERTAS ====================
export const GET_ALERTAS_BY_USUARIO = gql`
  query AlertasByUsuario($usuarioId: Int!) {
    alertasByUsuario(usuarioId: $usuarioId) {
      id
      tipo
      mensaje
      leida
      created_at
      familiarUsuario {
        nombre
        apellido
      }
    }
  }
`;

export const MARCAR_ALERTA_LEIDA = gql`
  mutation MarcarAlertaLeida($id: Int!) {
    marcarAlertaLeida(id: $id) {
      id
      leida
    }
  }
`;
