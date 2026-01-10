from enum import StrEnum
from pycountry import countries

class Country(StrEnum):
    for country in countries:
        vars()[country.alpha_2] = country.name

class Personality(StrEnum):
    empathetic = "empathetic"
    philosophical = "philosophical"
    practical = "practical"
    tough = "tough"

class TherapyStyle(StrEnum):
    cognitive_behavioral = "Cognitive Behavioral"
    humanistic = "Humanistic"
    psychodynamic = "Psychodynamic"
    problem_solving = "Problem Solving"

class Tone(StrEnum):
    warm = "warm"
    casual = "casual"
    formal = "formal"
    empowering = "empowering"

class SupportNeeded(StrEnum):
    stress = "stress"
    anxiety = "anxiety"
    depression = "depression"
    loneliness = "loneliness"
    relationships = "relationships"
    school = "school"
    work = "work"
    other = "other"

class Gender(StrEnum):
    male = "male"
    female = "female"
    non_binary = "non-binary"
    agender = "agender"
    other = "other"
    prefer_not_to_say = "prefer not to say"