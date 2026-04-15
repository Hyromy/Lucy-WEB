import { useOutletContext } from "react-router-dom"
import type { GuildResponse, LangResponse, LucyGuildResponse } from "../../types/api"
import useApi from "../../hooks/useApi"
import { useEffect } from "react"
import { guildService, langService } from "../../services/lucy"
import { Form, Select, Option } from "../../components/Form"
import { Button } from "../../components/Button"
import useLanguage from "../../contexts/Language"

type ApiResponse = [
  LucyGuildResponse,
  LangResponse[],
]

type FormExpectedData = {
  lang: string
}

export default function Config() {
  const { t } = useLanguage()
  const { 
    data: dataContext
  } = useOutletContext<{
    data: GuildResponse | null
    loading: boolean
    error: any
  }>()

  const { data: dataApi, error: errorApi, loading: loadingApi, request } = useApi<ApiResponse>()
  const { error: errorUpdate, request: requestUpdate } = useApi<LucyGuildResponse>()

  useEffect(() => {
    if (dataContext && !loadingApi && !dataApi) {
      request(
        guildService.get(dataContext?.id),
        langService.get(),
      )
    }
  }, [dataContext?.id, request, loadingApi, dataApi])

  useEffect(() => {
    if (errorApi) {
      console.error("Error API:", errorApi)
    }
    if (errorUpdate) {
      console.error("Error Update:", errorUpdate)
    }
  }, [errorApi, errorUpdate])

  const onSubmitHandler = (formData: FormExpectedData) => {
    requestUpdate(
      guildService.update(dataContext!.id, formData as unknown as Partial<LucyGuildResponse>),
    )
  }

  return loadingApi || !dataApi ? null : (
    <Form onSubmit={onSubmitHandler}>
      <Select name="lang" defaultValue={dataApi[0].lang.code}>
        {dataApi[1].map((lang) => (
          <Option
            key={lang.code}
            value={lang.code}
          >
            {lang.name}
          </Option>
        ))}
      </Select>
      <Button type="submit">{t("save")}</Button>
    </Form>
  )
}
