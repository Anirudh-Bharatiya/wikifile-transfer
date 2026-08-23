import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import projects from "../../utils/projects";
import { properCase } from "../../utils/helper";
import ISO6391 from "iso-639-1";
import { toast } from "react-toastify";

const ProjectLanguageStep = ({
  project,
  languages,
  availableLanguages,
  onProjectChange,
  onLanguagesChange,
  loading
}) => {
  const { t } = useTranslation();

  const handleLanguageChange = (event, newValue) => {
    if (newValue.length > 3) {
      toast.error(t("max-languages"));
      return;
    }
    onLanguagesChange(newValue);
  };

  return (
    <>
      <FormControl fullWidth margin="normal">
        <InputLabel id="project-select-label">{t("select-project")}</InputLabel>
        <Select
          id="project-select"
          labelId="project-select-label"
          label={t("select-project")}
          value={project}
          onChange={onProjectChange}
          disabled={loading}
        >
          {Object.keys(projects).map((proj) => (
            <MenuItem key={proj} value={proj}>
              {properCase(proj)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Autocomplete
          id="language-autocomplete"
          multiple
          disableCloseOnSelect
          limitTags={3}
          options={availableLanguages}
          value={languages}
          onChange={handleLanguageChange}
          disabled={loading || !project}
          getOptionLabel={(option) => {
            const nativeName = ISO6391.getNativeName(option);
            const englishName = ISO6391.getName(option);
            if (!nativeName && !englishName) return option;
            if (nativeName === englishName) return `${nativeName} [${option}]`;
            return `${nativeName} (${englishName}) [${option}]`;
          }}
          filterOptions={(options, { inputValue }) => {
            const search = inputValue.toLowerCase().trim();
            return options.filter((option) => {
              const code = option.toLowerCase();
              const nativeName = (ISO6391.getNativeName(option) || "").toLowerCase();
              const englishName = (ISO6391.getName(option) || "").toLowerCase();

              return (
                code.includes(search) ||
                nativeName.includes(search) ||
                englishName.includes(search)
              );
            });
          }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            const native = ISO6391.getNativeName(option);
            const english = ISO6391.getName(option);
            
            return (
              <li key={key} {...optionProps}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{native || option}</span>
                  {(english && english !== native) ? (
                    <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                      {english} [{option}]
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                      [{option}]
                    </span>
                  )}
                </div>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={t("select-language")}
              placeholder={t("select-language")}
            />
          )}
        />
    </>
  );
};

export default ProjectLanguageStep;