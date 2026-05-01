import { useOutletContext } from "react-router-dom"
import type { GuildResponse, LangResponse, LucyGuildResponse, RedisPayload } from "../../types/api"
import useApi from "../../hooks/useApi"
import { useCallback, useEffect } from "react"
import { guildService, langService } from "../../services/lucy"
import { Form, Select, Option } from "../../components/Form"
import { Button } from "../../components/Button"
import useLanguage from "../../hooks/useLanguage"
import useEvent from "../../hooks/useEvent"
import { StateGate } from "../../components/State"

type ContextData = {
  data: GuildResponse | null
  loading: boolean
  error: Error | null
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

  const fetchData = useCallback(() => {
    if (!dataContext?.id) return

    request(
      (signal) => guildService.get(dataContext.id, { signal }),
      (signal) => langService.get({ signal }),
    )
  }, [dataContext, request])

  useEffect(() => {
    if (dataContext?.id && !loadingApi && !dataApi) {
      fetchData()
    }
  }, [dataContext?.id, loadingApi, dataApi, fetchData])

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
  }, [dataContext, setDataApi]))

  const onSubmitHandler = (formData: FormExpectedData) => {
    requestUpdate(
      (signal) => guildService.update(dataContext!.id, formData as unknown as Partial<LucyGuildResponse>, { signal }),
    )
  }

  const render = () => (
    <Form onSubmit={onSubmitHandler}>
      <label>{t("manageGuild.config.form.lang")}</label>
      <Select 
        key={dataApi![0].updated_at}
        name="lang" 
        defaultValue={dataApi![0].lang.code}
      >
        {dataApi![1].map((lang) => (
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

  return (
    <StateGate
      data={dataApi}
      error={errorApi}
      loading={loadingApi || !dataApi}
      onRetry={fetchData}
    >
      {dataApi && render()}
    </StateGate>
  )
}
