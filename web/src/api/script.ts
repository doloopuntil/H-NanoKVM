import { http } from '@/lib/http.ts';

// A terminal unlock ticket for exactly one run, or one replacement of an existing script:
// scripts run as root. Adding a script under a new name needs none.
const UNLOCK_HEADER = 'X-NanoKVM-Terminal-Ticket';

export function uploadScript(formData: FormData, ticket?: string) {
  return http.request({
    url: '/api/vm/script/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(ticket ? { [UNLOCK_HEADER]: ticket } : {})
    },
    data: formData
  });
}

export function runScript(name: string, type: string, ticket: string) {
  return http.post('/api/vm/script/run', { name, type }, { headers: { [UNLOCK_HEADER]: ticket } });
}

export function getScripts() {
  return http.get('/api/vm/script');
}

export function deleteScript(name: string) {
  const data = {
    name
  };
  return http.delete('/api/vm/script', data);
}
