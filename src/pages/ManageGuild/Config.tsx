import { useOutletContext } from "react-router-dom"
import type { GuildResponse, LangResponse, LucyGuildResponse, RedisPayload } from "../../types/api"
import useApi from "../../hooks/useApi"
import { useCallback, useEffect } from "react"
import { guildService, langService } from "../../services/lucy"
import { Form, Select, Option } from "../../components/Form"
import { Button } from "../../components/Button"
import useLanguage from "../../contexts/Language"
import useEvent from "../../hooks/useEvent"

type ContextData = {
  data: GuildResponse | null
  loading: boolean
  error: any
}

type ApiResponse = [
  LucyGuildResponse,
  LangResponse[],
]

type FormExpectedData = {
  lang: string
}

export default function Config() {
  const { t } = useLanguage()
  const { data: dataContext } = useOutletContext<ContextData>()

  const { data: dataApi, setData: setDataApi, error: errorApi, loading: loadingApi, request } = useApi<ApiResponse>()
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

  useEvent(useCallback((eventData : LucyGuildResponse & RedisPayload) => {
    if (eventData.event == "lucy.guild.updated" && eventData.id == dataContext?.id) {
      setDataApi((prev) => {
        if (!prev || eventData.version <= prev[0].version) return null
        return [
          {
            ...prev[0],
            ...eventData
          },
          prev[1]
        ]
      })
    }
  }, [dataContext?.id, setDataApi]))

  const onSubmitHandler = (formData: FormExpectedData) => {
    requestUpdate(
      guildService.update(dataContext!.id, formData as unknown as Partial<LucyGuildResponse>),
    )
  }

  return loadingApi || !dataApi ? null : (
    <Form onSubmit={onSubmitHandler}>
      <label>{t("manageGuild.config.form.lang")}</label>
      <Select 
        key={dataApi[0].updated_at}
        name="lang" 
        defaultValue={dataApi[0].lang.code}
      >
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
