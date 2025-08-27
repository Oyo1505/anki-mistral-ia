'use client'

import { ParsedChatResponse } from "@/utils/string/parse-response";

interface ParsedMessageProps {
  parsedResponse: ParsedChatResponse;
}

const ParsedMessage = ({ parsedResponse }: ParsedMessageProps) => {
  const { japanese, french, exercises, level } = parsedResponse;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border">
      {/* Section Japonais */}
      {japanese && (
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">🇯🇵 Japonais</h3>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {japanese}
          </div>
        </div>
      )}

      {/* Section Français */}
      {french && (
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">🇫🇷 Français</h3>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {french}
          </div>
        </div>
      )}

      {/* Exercices */}
      {exercises && exercises.length > 0 && (
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="text-lg font-semibold text-purple-700 mb-2">📚 Exercices</h3>
          <div className="space-y-3">
            {exercises.map((exercise, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <h4 className="font-medium text-purple-600 mb-2">{exercise.type}</h4>
                <div className="text-gray-700 whitespace-pre-wrap text-sm">
                  {exercise.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Niveau */}
      {level && (
        <div className="text-xs text-gray-500 text-center">
          Niveau: {level}
        </div>
      )}
    </div>
  );
};

export default ParsedMessage;
