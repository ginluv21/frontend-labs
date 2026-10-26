import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveAdvice } from '@/api/saved'
import { Button } from '@/shared/Button'

export function SaveButton({ source, text }) {
  const client = useQueryClient()
  const save = useMutation({
    mutationFn: saveAdvice,
    onSuccess: () => client.invalidateQueries({ queryKey: ['saved'] }),
  })

  function handleSave() {
    if (save.isPending || save.isSuccess) return
    save.mutate({ source, text })
  }

  return (
    <div className="save-control">
      <Button onClick={handleSave} disabled={save.isPending || save.isSuccess}>
        {save.isPending ? 'Сохраняю...' : save.isSuccess ? 'Сохранено' : 'В копилку'}
      </Button>
      {save.isError && <p role="alert">{save.error.message} Нажми «В копилку» ещё раз.</p>}
      {save.isSuccess && <p role="status">Совет теперь в общей копилке.</p>}
    </div>
  )
}
