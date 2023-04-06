import { IThesis } from "../libs/model"
import { awardGradeOption, awardLevelOption, copyRightType, disciplineOneOption, principalClassificationNumberOption, publicationNameOption } from "../libs/data"

export const renderPublicationName = (values: string) => {
  const index = publicationNameOption.findIndex(item => item.value === values)
  return publicationNameOption[index].label
}

export const renderDisciplineOne = (values: string) => {
  const index = disciplineOneOption.findIndex(item => item.value === values)
  return disciplineOneOption[index].label
}

export const renderPrincipalClassificationNumberOption = (values: string) => {
  const index = principalClassificationNumberOption.findIndex(item => item.value === values)
  return principalClassificationNumberOption[index].label
}

export const renderCopyRightType = (values: string) => {
  const index = copyRightType.findIndex(item => item.value === values)
  return copyRightType[index].label
}

export const renderAwardGradeOption = (values: string) => {
  const index = awardGradeOption.findIndex(item => item.value === values)
  return awardGradeOption[index].label
}

export const renderAwardLevelOption = (values: string) => {
  const index = awardLevelOption.findIndex(item => item.value === values)
  return awardLevelOption[index].label
}